import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import AppointmentRepository from '../repositories/AppointmentsRepository';
import Appointment from '../models/Appointment';

import AppErrors from '../errors/AppError';


interface Request{
  provider_id: string;
  date: Date;
}

class CreateAppointmentService{
  // private appointmentsRepository: AppointmentRepository;

  // constructor(appointmentsRepository: AppointmentRepository){
  //   this.appointmentsRepository = appointmentsRepository;
  // }

  public async execute({ provider_id, date }:Request): Promise<Appointment>{
    const appointmentsRepository = getCustomRepository(AppointmentRepository);
    const appointmentDate = startOfHour(date);

    if ( await appointmentsRepository.findByDate(appointmentDate)) {
      throw new AppErrors("This appointment is already booked");
    }

    const appointment = appointmentsRepository.create({
      provider_id,
      date: appointmentDate
    });
    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
