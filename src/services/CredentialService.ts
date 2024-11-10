import bcrypt from "bcrypt";

export class CredentialService {
    async giveHashedPassword(password: string) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        return hashedPassword;
    }

    async comparePassword(userPassword: string, hashedPassword: string) {
        const VerifyPassword = await bcrypt.compare(
            userPassword,
            hashedPassword,
        );

        return VerifyPassword;
    }
}
