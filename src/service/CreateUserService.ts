import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '../models/User';

import AppErrors from '../errors/AppError';

interface Resquest {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute ({name, email, password}:Resquest): Promise<User> {
    const userRepository = getRepository(User);

    const checkUserExist = await userRepository.findOne({
      where: { email },
    });

    if(checkUserExist){
      throw new AppErrors('Email address already used');
    }
    const hashedPassword = await hash(password, 8);
    const user = userRepository.create({
      name,
      email,
      password: hashedPassword
    });

    await userRepository.save(user);

    return user;

  }

}

export default CreateUserService;
