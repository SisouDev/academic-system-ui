import { Modal } from 'react-bootstrap';
import {CreateMeetingForm} from "../../../pages/agenda/CreateMeetingForm.tsx";

export const CreateMeetingModal = ({ show, onHide }: { show: boolean, onHide: () => void }) => {
    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Agendar Nova Reunião</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <CreateMeetingForm onDone={onHide} />
            </Modal.Body>
        </Modal>
    );
};