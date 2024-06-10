package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"
	uuid "github.com/satori/go.uuid"
)

type ClientManager struct {
	clients    map[*Client]bool
	broadcast  chan []byte
	register   chan *Client
	unregister chan *Client
}

type Client struct {
	id     string
	socket *websocket.Conn
	send   chan []byte
	name   string
}

type Message struct {
	ID        string `json:"id"`
	Sender    string `json:"sender,omitempty"`
	Recipient string `json:"recipient,omitempty"`
	Content   string `json:"content,omitempty"`
}

var manager = ClientManager{
	broadcast:  make(chan []byte),
	register:   make(chan *Client),
	unregister: make(chan *Client),
	clients:    make(map[*Client]bool),
}

func (manager *ClientManager) start() {
	for {
		select {
		case conn := <-manager.register:
			manager.clients[conn] = true
			fmt.Println("Client registered:", conn.id)
			jsonMessage, _ := json.Marshal(&Message{ID: uuid.NewV4().String(), Content: "/A new socket has connected."})
			manager.send(jsonMessage, nil)
		case conn := <-manager.unregister:
			if _, ok := manager.clients[conn]; ok {
				close(conn.send)
				delete(manager.clients, conn)
				fmt.Println("Client unregistered:", conn.id)
				jsonMessage, _ := json.Marshal(&Message{ID: uuid.NewV4().String(), Content: "/A socket has disconnected."})
				manager.send(jsonMessage, nil)
			}
		case message := <-manager.broadcast:
			fmt.Println("Broadcasting message:", string(message))
			for conn := range manager.clients {
				select {
				case conn.send <- message:
				default:
					close(conn.send)
					delete(manager.clients, conn)
				}
			}
		}
	}
}

func (manager *ClientManager) send(message []byte, ignore *Client) {
	for conn := range manager.clients {
		if conn != ignore {
			fmt.Println("Sending message to client:", conn.id)
			conn.send <- message
		}
	}
}

func (c *Client) read() {
	defer func() {
		manager.unregister <- c
		c.socket.Close()
	}()

	for {
		_, message, err := c.socket.ReadMessage()
		if err != nil {
			fmt.Println("Error reading message:", err)
			manager.unregister <- c
			c.socket.Close()
			break
		}
		fmt.Println("Received message from client:", c.id, string(message))
		var receivedMessage Message
		err = json.Unmarshal(message, &receivedMessage)
		if err != nil {
			fmt.Println("Error unmarshalling message:", err)
			continue
		}
		receivedMessage.ID = uuid.NewV4().String()
		receivedMessage.Sender = c.name
		jsonMessage, _ := json.Marshal(receivedMessage)
		manager.broadcast <- jsonMessage
	}
}

func (c *Client) write() {
	defer func() {
		c.socket.Close()
	}()

	for {
		select {
		case message, ok := <-c.send:
			if !ok {
				c.socket.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}
			fmt.Println("Sending message to client:", c.id, string(message))
			err := c.socket.WriteMessage(websocket.TextMessage, message)
			if err != nil {
				fmt.Println("Error writing message:", err)
			}
		}
	}
}

func wsPage(res http.ResponseWriter, req *http.Request) {
	conn, err := (&websocket.Upgrader{CheckOrigin: func(r *http.Request) bool { return true }}).Upgrade(res, req, nil)
	if err != nil {
		http.NotFound(res, req)
		return
	}

	name := req.URL.Query().Get("username")
	if name == "" {
		name = "Anonymous"
	}

	client := &Client{id: uuid.NewV4().String(), socket: conn, send: make(chan []byte), name: name}

	fmt.Println("Registering new client with name:", name)
	manager.register <- client

	go client.read()
	go client.write()
}

func main() {
	fmt.Println("Starting application....")
	go manager.start()
	http.HandleFunc("/ws", wsPage)
	if err := http.ListenAndServe(":1234", nil); err != nil {
		fmt.Println("Error starting server:", err)
	}
}
