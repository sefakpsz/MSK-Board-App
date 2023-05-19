import { sign, verify } from 'jsonwebtoken'
import { randomInt, createCipheriv, createDecipheriv } from 'crypto';

const tokenKey = Buffer.from(process.env.tokenKey as string, 'hex')
const payloadKey = Buffer.from(process.env.payloadKey as string, 'hex')
const payloadIv = Buffer.from(process.env.payloadIv as string, 'hex')
const encryptionAlgorithm = process.env.encryptionAlgorithm as string

//

export const createToken = (userId: string) => {

    const cipherUserId = createCipheriv(encryptionAlgorithm, payloadKey, payloadIv);
    const encryptedUserId = cipherUserId.update(userId, 'utf-8', 'hex') + cipherUserId.final('hex');

    const cipherPayload = createCipheriv(encryptionAlgorithm, payloadKey, payloadIv);
    const encryptedPayload = cipherPayload.update(encryptedUserId, 'utf8', 'hex') + cipherPayload.final('hex');

    const dummyEmails = [
        "sefakapisiz@gmail.com",
        "taharamazan@hotmail.com",
        "mehmetkaya@outlook.com",
        "aliefe@gmail.com",
        "osmanşen@hotmail.com",
        "aysotas@hotmail.com",
        "tugcesener@gmail.com"
    ]
    const whichOne = randomInt(1, 7);

    const token = sign(
        {
            userId: encryptedPayload,
            // to misguiding to middleman
            email: dummyEmails[whichOne]
        },
        tokenKey,
        {
            expiresIn: "3d",
        }
    );

    return token;
}


export const verifyToken = (token: string) => {

    try {
        //encrypting token
        const decodedToken = verify(token, tokenKey) as { userId: string };

        //encrypting fake payload
        const decipher = createDecipheriv(encryptionAlgorithm, payloadKey, payloadIv);
        const decryptedPayload = decipher.update(decodedToken.userId, 'hex', 'utf-8') + decipher.final('utf8');

        //encrypting payload
        const secondDecipher = createDecipheriv(encryptionAlgorithm, payloadKey, payloadIv);
        const secondDecryptedPayload = secondDecipher.update(decryptedPayload, 'hex', 'utf-8') + secondDecipher.final('utf8');

        return secondDecryptedPayload

    } catch (error) {
        console.log("Invalid Token");
    }
}


/*

userId decryption

const user = JSON.parse(decryptedPayload) as { email: string, userId: string }

        const decipherUserId = createDecipheriv('aes256', payloadKey, iv);
        const decryptedUserId = decipherUserId.update(user.userId, 'hex', 'utf-8') + decipherUserId.final('utf8');

*/