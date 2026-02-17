import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

@Injectable()
export class AuthService {
    // PrismaService để tương tác với Database
    constructor(private prisma: PrismaService) { }


    async register(input: { email: string; pass: string; fullname: string }) {
        //Kiểm tra xem email đã tồn tại chưa
        const existingUser = await this.prisma.user.findUnique({
            where: { email: input.email }
        });

        if (existingUser) {
            throw new ConflictException('Email này đã được sử dụng.');
        }

        //Mã hóa mật khẩu (Hashing)
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(input.pass, saltRounds);

        //Lưu người dùng mới vào Database
        const newUser = await this.prisma.user.create({
            data: {
                email: input.email,
                password: hashedPassword,
                name: input.fullname
            },
        });

        return {
            success: true,
            message: 'Đăng ký thành công! Bạn có thể đăng nhập ngay.'
        };
    }

    async login(input: { email: string; pass: string }) {
        //Tìm người dùng theo email
        const user = await this.prisma.user.findUnique({
            where: { email: input.email }
        });

        if (!user) {
            throw new UnauthorizedException('Email hoặc mật khẩu không đúng!');
        }

        //Kiểm tra mật khẩu
        const isPasswordValid = await bcrypt.compare(input.pass, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Email hoặc mật khẩu không đúng!');
        }

        //Tạo Token
        const tokenPayload = {
            userId: user.id,
            email: user.email
        };

        const token = jwt.sign(tokenPayload, JWT_SECRET, {
            expiresIn: '7d',
        });

        //Trả về thông tin user và Token cho Frontend
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            token: token, // Frontend sẽ lưu cái này vào Cookie
        };
    }
}