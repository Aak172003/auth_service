import bcrypt from "bcrypt";

export const giveHashedPassword = async (password: string) => {
    console.log("this is password ------------- ", password);

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    console.log(
        "hashedPassword ---------- hashedPassword ------------ ",
        hashedPassword,
    );

    return hashedPassword;
};
