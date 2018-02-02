const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');
const {jwt} = require('jsonwebtoken');

const {app} = require('./../server');
const {todo} = require('./../models/todo');
const {user} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require("./seed/seed");

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Test todo text';
    
        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                
                todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
            }).catch((e) => done(e));
        });
    });
    
    it('should not create a todo with invalid body data', (done) => {
        
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                
                todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
            }).catch((e) => done(e));   
        });  
    });
});


describe('GET /todos', () => {
  it('should get all todos', (done) => {
      request(app)
          .get('/todos')
          .expect(200)
          .expect((res) => {
            expect(res.body.todo.length).toBe(2);
      })
      .end(done);
  });  
});


describe('GET /todos/:id', () => {
    it('should get todo with a certain id', (done) => {
      
      request(app)
          .get('/todos/' + todos[0]._id.toHexString())
          .expect(200)
          .expect((res) => {
            expect(res.body.todo.text).toBe(todos[0].text);
            })
          .end(done);
    });
    
    it('should return 404 if todo not found', (done) => {
      var hexId = new ObjectId().toHexString();
      request(app)
          .get('/todos/' + hexId)
          .expect(404)
          .end(done);
    });
    
    it('should return 404 if id invalid', (done) => {
      
      request(app)
          .get('/todos/12abc')
          .expect(404)
          .end(done);
    });
});


describe('DELETE /todos/:id', () => {
    it('should remove todo with a certain id', (done) => {
      request(app)
          .delete('/todos/' + todos[0]._id.toHexString())
          .expect(200)
          .expect((res) => {
            expect(res.body.todo._id).toBe(todos[0]._id.toHexString());
            })
          .end((err, res) => {
          
            if(err){
                return done(err);
            }
          
          todo.findById(todos[0]._id.toHexString()).then((todo) => {
              expect(todo).toBeNull();
              done();
          }).catch((e) => done(e));
      });
    });
    
    it('should return 404 if todo not found', (done) => {
      var hexId = new ObjectId().toHexString();
      request(app)
          .delete('/todos/' + hexId)
          .expect(404)
          .end(done);
    });
    
    it('should return 404 if id invalid', (done) => {
      request(app)
          .delete('/todos/12abc')
          .expect(404)
          .end(done);
    });
});


describe('PATCH /todos/:id', () => {
    it('should update todo with a certain id', (done) => {
        
        var updatedObj = {
            completed: true,
            text: "Updated Cenas0"
        }
        
        request(app)
          .patch('/todos/' + todos[0]._id.toHexString())
          .send(updatedObj)
          .expect(200)
          .expect((res) => {
            expect(res.body.todo.text).toBe(updatedObj.text);
            expect(res.body.todo.completed).toBe(true);
            expect(typeof(res.body.todo.completedAt)).toBe('number');
            })
          .end(done);
    });
    
    it('should clear completedAt when todo is not completed', (done) => {
        var updatedObj = {
            completed: false,
            text: "Updated Cenas1"
        }
        
        request(app)
          .patch('/todos/' + todos[1]._id.toHexString())
          .send(updatedObj)
          .expect(200)
          .expect((res) => {
            expect(res.body.todo.text).toBe(updatedObj.text);
            expect(res.body.todo.completed).toBeFalsy();
            expect(res.body.todo.completedAt).toBeNull();
            })
          .end(done);
    });
    
   
});

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => { //done passed for assync
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
        })
        .end(done);
    });
    
    it('should return 401 if not authenticated', (done) => { //done passed for assync
       request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
        })
        .end(done);
    }); 
});

describe('POST /users', () => {
    it('should create a user', (done) => {
        var email ="testemail@test.com";
        var password ="testepassword";
        
        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.body.email).toBe(email);
                expect(res.body._id).toBeTruthy();
                expect(res.headers["x-auth"]).toBeTruthy();
            })
          .end((err) => {
            if(err) {
                return done(err);
            }
            
            user.findOne({email}).then((doc) => {
                expect(doc).toBeTruthy();
                expect(doc.password).not.toBe(password);
                done();
            })
        });
        
    });
    
    it('should return validation errors if email/password does not meet validation criteria', (done) => {
        var email ="teste2222@cenas1.com";
        var password ="123";
        
        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done)
    });
    
    it('should not create user if email in use', (done) => {
        var email ="miguelponte@cenas1.com";
        var password ="123456789";
        
        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done)
       
    });
});