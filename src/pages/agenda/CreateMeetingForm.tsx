import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { Form, Button, Spinner, Alert, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import api from '../../services/auth/api';
import { RichTextEditor } from '../../features/common/RichTextEditor';
import type { CreateMeetingData, PersonSummary } from '../../types';

type MeetingFormData = {
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    visibility: 'PUBLIC' | 'PRIVATE';
    participantIds: number[];
};

const getSelectableParticipants = async (): Promise<PersonSummary[]> => {
    const { data } = await api.get('/api/v1/people/selectable-participants');
    return data;
};

const createMeetingRequest = (data: CreateMeetingData) => {
    return api.post('/api/v1/meetings', data);
};

export const CreateMeetingForm = ({ onDone }: { onDone: () => void }) => {
    const queryClient = useQueryClient();
    const { data: participants, isLoading: isLoadingParticipants } = useQuery({
        queryKey: ['selectableParticipants'],
        queryFn: getSelectableParticipants,
    });

    const { control, register, handleSubmit, formState: { errors } } = useForm<CreateMeetingData>();

    const { mutate, isPending, error } = useMutation({
        mutationFn: createMeetingRequest,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['agenda'] });
            onDone();
        }
    });

    const onSubmit: SubmitHandler<MeetingFormData> = (formData) => {
        const formattedData = {
            ...formData,
            startTime: new Date(formData.startTime).toISOString(),
            endTime: new Date(formData.endTime).toISOString(),
            participantIds: formData.participantIds || [],
        };
        mutate(formattedData);
    };

    const participantOptions = participants?.map(p => ({ value: p.id, label: p.fullName })) || [];

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            {error && <Alert variant="danger">{(error as Error).message}</Alert>}

            <Form.Group className="mb-3">
                <Form.Label>Título da Reunião</Form.Label>
                <Form.Control
                    type="text"
                    {...register('title', { required: "O título é obrigatório." })}
                    isInvalid={!!errors.title}
                />
                <Form.Control.Feedback type="invalid">{errors.title?.message}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Visibilidade</Form.Label>
                <Form.Select {...register('visibility', { required: true })}>
                    <option value="PRIVATE">Privada (Apenas convidados)</option>
                    <option value="PUBLIC">Pública (Visível a todos)</option>
                </Form.Select>
            </Form.Group>

            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Início</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            {...register('startTime', { required: "A data de início é obrigatória." })}
                            isInvalid={!!errors.startTime}
                        />
                        <Form.Control.Feedback type="invalid">{errors.startTime?.message}</Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Fim</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            {...register('endTime', { required: "A data de término é obrigatória." })}
                            isInvalid={!!errors.endTime}
                        />
                        <Form.Control.Feedback type="invalid">{errors.endTime?.message}</Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Form.Group className="mb-3">
                <Form.Label>Participantes</Form.Label>
                <Controller
                    name="participantIds"
                    control={control}
                    render={({ field }) => (
                        <Select
                            isMulti
                            options={participantOptions}
                            isLoading={isLoadingParticipants}
                            placeholder="Selecione os participantes..."
                            onChange={selectedOptions => field.onChange(selectedOptions.map(option => option.value))}
                            noOptionsMessage={() => 'Nenhum participante encontrado'}
                        />
                    )}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Descrição</Form.Label>
                <Controller name="description" control={control} render={({ field }) => <RichTextEditor value={field.value || ''} onEditorChange={field.onChange} />} />
            </Form.Group>

            <Button type="submit" disabled={isPending}>{isPending ? <Spinner size="sm"/> : 'Agendar Reunião'}</Button>
        </Form>
    );
};