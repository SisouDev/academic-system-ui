import { Header } from '../components/header/Header';
import { Footer } from '../components/Footer';
import { CardGrid } from '../components/card/CardGrid';
import './Dashboard.scss';

const DUMMY_CARD_DATA = [
    { id: 1, title: 'Cursos Matriculados', content: 'Você está matriculado em 5 cursos.' },
    { id: 2, title: 'Próxima Avaliação', content: 'Cálculo I - Prova dia 30/06/2025.' },
    { id: 3, title: 'Mensagens', content: 'Você tem 2 mensagens não lidas.' },
];

export function Dashboard() {
    return (
        <div className="dashboard-layout">
            <Header />

            <main className="uk-flex-auto uk-section">
                <div className="uk-container">
                    <CardGrid items={DUMMY_CARD_DATA} />
                </div>
            </main>

            <Footer />
        </div>
    );
}