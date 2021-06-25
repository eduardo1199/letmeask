import illustration from '../images/illustration.svg';
import logo from '../images/logo.svg';
import google from '../images/google-icon.svg';
import '../styles/home.scss';
import { Button } from '../components/Button';
import {useHistory} from 'react-router-dom';

export function Home(){

    const history = useHistory();

    function navegationNewRoom(){
        history.push('/newRoom');
    }

    return(
        <div id='page-auth'>
           <aside>
               <img src={illustration} alt="illustration" />
               <strong>Crie Salas de Q&A ao-vivo</strong>
               <p>Tire as dúvidas da sua audiência em tempo-real</p>
           </aside>
           <main>
               <div className="main-content">
                    <img src={logo} alt="logo" />
                    <button className="run" onClick={() => navegationNewRoom()}>
                        <img src={google} alt="" />
                        Crie sua sala com o google
                    </button>
                    <div className="saparator">Ou entre em uma sala</div>
                    <form action="">
                        <input type="text" placeholder="Digite código da sala"/>
                        <Button type="submit" className="button">Entrar na sala</Button>
                    </form>
               </div>
           </main>
        </div>
    ); 
}

