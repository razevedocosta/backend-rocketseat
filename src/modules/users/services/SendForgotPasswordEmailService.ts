import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IUserRepository from '@modules/users/repositories/IUsersRepository';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

// import User from "../infra/typeorm/entities/User";

interface IRequest {
    email: string;
}

@injectable()
class SendForgotPasswordEmailService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUserRepository,
        
        @inject('MailProvider')
        private mailProvider: IMailProvider,
        
        @inject('UserTokensRepository')
        private userTokensRepository: IUserTokensRepository,
    ){};

    public async execute({ email }: IRequest): Promise<void>{
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new AppError('User does not exists');
        }

        await this.userTokensRepository.generate(user.id);

        this.mailProvider.sendMail(email, 'Recuperação de senha');
    }
}

export default SendForgotPasswordEmailService;