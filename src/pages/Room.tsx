import logoImg from '../images/logo.svg';
import {Button} from '../components/Button';
import '../styles/room.scss';
import {RoomCode} from '../components/RoomCode';
import { useParams} from 'react-router-dom';
import { useState, FormEvent } from 'react';
import useAuth from '../hooks/AthContext';
import { database } from '../services/Firebase';
import {Questions} from '../components/Question';
import {useRoom} from '../hooks/useRoom';


type PathName = {
  id: string;
}

export function Room(){

  const {user}= useAuth();
  const params = useParams<PathName>();
  const paramsId: string = params.id;
  const [newQuestion, setNewQuestion] = useState('');
  const {listQuestions, title} = useRoom(paramsId);
   
  async function createQuestion(event: FormEvent){
    event.preventDefault();

    if(newQuestion.trim() === ''){
      return;
    }
    if(!user){
      throw new Error("Invalid User");
    }
    let question = {
      content: newQuestion,
      author: {
        name: user.displayName,
        avatar: user.photoURL,
      },
      isHighLight: false,
      isAnswered: false
    }
    await database.ref(`rooms/${paramsId}/questions`).push(question);
    setNewQuestion('');
    alert("Comentario Enviado Com Sucesso");
  }

  async function handleLikeQuestion(questionId: string, likedId: string | undefined){
   if(likedId){
     await database.ref(`rooms/${paramsId}/questions/${questionId}/likes/${likedId}`).remove();
   } else {
     await database.ref(`rooms/${paramsId}/questions/${questionId}/likes`).push({
      authorId: user?.uid,
    });
   }
  }

  return(
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Logo" />
          <RoomCode code={params.id} />
        </div>
      </header>
      <main>
        <div className="room-tittle">
          <h1>{title}</h1>
          {listQuestions.length > 0 && <span>{listQuestions.length} perguntas</span>}
        </div>
        <form onSubmit={createQuestion}>
          <textarea 
            name="question" 
            placeholder="O que voce quer perguntar" 
            onChange={e => setNewQuestion(e.target.value)}
            value={newQuestion}/>
          <div className="form-footer">
            {!user ? 
              <span>Para enviar uma pergunta, <button>faça seu login.</button></span>
              : 
              <div className="user-info">
                <img src={user.photoURL} alt={user.displayName}></img>
                <span>{user.displayName}</span>
              </div>
            }
            <Button type="submit" disabled={!user}>Enviar Pergunta</Button>
          </div>
        </form>
        {listQuestions.length > 0 ? (
          <div className="list-questions">
            {listQuestions.map((question) => {
              return(
                <Questions
                  key={question.key} 
                  content={question.content}
                  author={question.author}
                  isAnswered={question.isAnswered}
                  isHighLight={question.isHighLight}
                >
                  {!question.isAnswered && (
                    <>
                      <button
                        className={`like-button ${question.likedId ? 'liked' : ''}`}
                        type="button"
                        aria-label="Marcar como gostei"
                        onClick={() => handleLikeQuestion(question.key, question.likedId)}
                      >
                          {question.likeCount > 0 && <span>{question.likeCount}</span>}
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                      </button>
                    </>
                  )}
                </Questions>
              )
           })}
          </div>
        ):(
          <div className="no-Questions">
            <span>Não tem perguntas nessa sala!</span>
          </div>
        )}
      </main>
    </div>
  );
}