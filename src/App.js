import { db } from './firebase'
import { v4 } from 'uuid'
import { set, ref, onValue, remove, update } from 'firebase/database'
import React, { useState, useEffect } from 'react'
import { Button, Card, Container, Grid, } from 'semantic-ui-react'
import './App.css'

function App() {

  const [todo, setTodo] = useState([])
  const [userEmail, setUserEmail] = useState([])
  const [subject, setSubject] = useState([])
  const [message, setMessage] = useState([])
  const [todos, setTodos] = useState([])
  const [isEdit, setIsEdit] = useState(false)
  const [tempuuid, setTempUuid] = useState("")

  //WRITE in realTime database firebase
  const writeToDatabase = () => {
    const uuid = v4();
    set(ref(db, `/${uuid}`), {
      todo,
      userEmail,
      subject,
      message,
      uuid,
    });
    setTodo('')
    setUserEmail('')
    setSubject('')
    setMessage('')
  };
  //READ in realTime database firebase
  useEffect(() => {
    onValue(ref(db), (snapshot) => {
      setTodos([])
      const data = snapshot.val()
      if (data !== null) {
        Object.values(data).map((todo) => (
          setTodos((oldArray) => [...oldArray, todo])
        ))
      }
    });

  }, []);

  //UPDATE in realTime database firebase
  const handleUpdate = (todo) => {
    setIsEdit(true)
    setTempUuid(todo.uuid)
    setTodo(todo.todo)
    setUserEmail(todo.userEmail)
    setMessage(todo.message)
    setSubject(todo.subject)
  }

  const handleSubmitChange = () => {
    update(ref(db, `${tempuuid}`), {
      todo,
      userEmail,
      subject,
      message,
      uuid: tempuuid,
    })
    setTodo('')
    setUserEmail('')
    setSubject('')
    setMessage('')
    setIsEdit(false)
  }

  //DELETE in realTime database firebase

  const handleDelete = (todo) => {
    remove(ref(db, `/${todo.uuid}`))
  }

  const onTodoChange = e => setTodo(e.target.value)
  const onEmaiChange = e => setUserEmail(e.target.value)
  const onSubChange = e => setSubject(e.target.value)
  const onMessageChange = e => setMessage(e.target.value)

  return (
    <>
      <div style={{ width: '75%' }}>
        <p>Contact Form</p>
        <form>

          <label htmlFor='fname'>Full Name :</label>
          <input
            type="text"
            id='fname'
            placeholder="Add a Name.."
            value={todo}
            onChange={onTodoChange}
          />

          <label htmlFor='email'>Email address :</label>
          <input
            type="email"
            id='email'
            placeholder="name@example.com"
            value={userEmail}
            onChange={onEmaiChange}
          />

          <label htmlFor='subject'>Subject :</label>
          <input
            type="text"
            id='subject'
            placeholder="Subject.."
            value={subject}
            onChange={onSubChange}
          />

          <label htmlFor='message'>Message "</label>
          <textarea
            id='message'
            rows="8"
            value={message}
            onChange={onMessageChange}
          ></textarea>

          {isEdit ? (
            <>
              <input type='submit' value='Update Fields' style={{ color: 'red' }} onClick={handleSubmitChange} />
              <input type='submit' value='Delete Update' onClick={() => {
                setIsEdit(false)
                setTodo('')
                setUserEmail('')
                setSubject('')
                setMessage('')
              }} />
            </>
          ) : (
            <input type='submit' value='Submit' style={{ color: 'red' }} onClick={writeToDatabase} />
          )}
        </form >
      </div>
      <Container>
        <Grid columns={4} stackable>
          {todos.map((todo) => (
            <Grid.Column key={todo.uuid}>
              <Card>
                <Card.Content>
                  <Card.Header style={{ marginTop: '10px' }}>{todo.todo}</Card.Header>
                  <Card.Header style={{ marginTop: '10px' }}>{todo.userEmail}</Card.Header>
                  <Card.Description>{todo.subject}</Card.Description>
                  <Card.Description>{todo.message}</Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <div>
                    <Button onClick={() => handleUpdate(todo)} color='green'>Update</Button>
                    <Button color='red' onClick={() => handleDelete(todo)}>Delete</Button>
                  </div>
                </Card.Content>
              </Card>
            </Grid.Column>
          ))}
        </Grid>
      </Container>

    </>

  );
}

export default App;