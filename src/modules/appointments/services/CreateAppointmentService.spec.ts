import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

import AppError from '@shared/errors/AppError';

describe('CreateAppointment', () => {
    it('should be able to create a new appointment', async () => {
        const fakeAppointmentRepository = new FakeAppointmentsRepository();
        const createAppointmet = new CreateAppointmentService(fakeAppointmentRepository);

        const appointment = await createAppointmet.execute({
            date: new Date(),
            provider_id: '123',
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('123');
    });

    it('should not be able to create two appointments on the same time', async () => {
        const fakeAppointmentRepository = new FakeAppointmentsRepository();
        const createAppointmet = new CreateAppointmentService(fakeAppointmentRepository);

        const appointmentDate = new Date(2020, 4, 10, 11);

        await createAppointmet.execute({
            date: appointmentDate,
            provider_id: '123',
        });

        expect(createAppointmet.execute({
            date: appointmentDate,
            provider_id: '123',
        })).rejects.toBeInstanceOf(AppError);
    });
});