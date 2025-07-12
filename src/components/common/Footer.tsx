import { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import './Footer.scss';

export const Footer = () => {
    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true
        });
    }, []);

    return (
        <footer className="footer bg-dark text-light py-4">
            <Container>
                <Row className="align-items-center text-center text-md-start">
                    <Col md={6} data-aos="fade-right">
                        <h5 className="footer-title">Feito com 💻 por Karolina</h5>
                        <p className="mb-0 small text-white-50">© {new Date().getFullYear()} Todos os direitos reservados.</p>
                    </Col>

                    <Col md={6} className="text-center text-md-end mt-3 mt-md-0" data-aos="fade-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="footer-icons"
                        >
                            <a href="https://github.com/karolinasf" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                                <Github size={24} className="icon" />
                            </a>
                            <a href="https://linkedin.com/in/seu-linkedin" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                                <Linkedin size={24} className="icon" />
                            </a>
                            <a href="mailto:seu-email@dominio.com" aria-label="Email">
                                <Mail size={24} className="icon" />
                            </a>
                        </motion.div>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};