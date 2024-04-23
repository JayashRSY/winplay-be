import { GoogleAuth } from 'google-auth-library';
import { google } from 'googleapis';
import stream from 'stream';
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(path.dirname(__filename), '../');
const KEYFILEPATH = path.join(__dirname, "../cred.json");
const SCOPE = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.file'
];

const authJWT = async () => {
    const jwtClient = new google.auth.JWT(
        "displate@dev-app-416610.iam.gserviceaccount.com",
        null,
        "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCye9lJTh2Y7TiL\nk6czJ3V4pkADCM4EF0O/2FE3PMqgDoHVzPJ8l0o5SCPEnVIejVKMj2FtDmNfqXok\nqby7IwRyEtQ/tpna0TY108rMGggs8FX2f81o4rGlq4cJaREfeaGD1KLa3JdMnlPP\nkRya1NRdXkiAaOAR7bvBsPbzZoLdxrsSNhRRF0XeY7lQAbVpuKD7a+UdFUuGQqQl\nwJGMDhnkYkfRELUPYPiP45jPRusRLm8R2y+Scn8/5CWfsC6lOufOFCS7hHFWwCYB\nsMga4mRpv9LryGjlaH1s6UeYMbjsmUQxyOrc6i4MsMiHe0aggAwhWnCBqexc8Sob\nUqbHguvXAgMBAAECggEADae4Cgm17ftINjWHtzwvmpltkE3eJSX6gvTz0bwO7Ivv\nlwHlE28nuJYyVlqK69d4F1To6UUOiUUYGTH7RH37WxbhsjYwMzOKaDfZ7h+XvIhu\nqzs/5eRiHwCuhiPJsZTGrKVaCFCUKsJ6OwkpHRdnX/VUqq5bZkO/96OoYRrYrErl\nU2IgFcL3NFeKOmQdhjKkBS2Qzq8andmn7rf/eS9TButkIBywX8m49NrRsFvzTAb2\nt1M25+J1IvuJ1qKL2YKM2ug6NYatyqTKWZLJHYtsi3/WD27XVdlQZ8x/SjJHiim0\nhBsLIamU/K6p0lq/mi5dtHnPF0u301QPG7NEsyickQKBgQDX9iHxFhEh+bXiWkrH\nxALRYG3flZSKUqsw/G4z+wDeVeV68bJ2qxxUZyBbHhTEHgdTDB1Lyaqdq2HwNgld\nchergUQYFJA03D2b1dRLqzOImndC5IkzTpwRRuR7abtcjHyPkpNHs9ZkCLYR88aj\n5bSX35kyrQt0ft/yJ1b4iHe8MwKBgQDTkvesyLRmTYMgfEiMHMRMznqZ/Y0lbchf\no3Qny1FvHJvkSDKdvetbBB17aTlRVAu0dskcTKR/X/zORMTQYUXVZZI2ojYieVth\nGld/lb56Pl02Tq5FLWI1+KJN1LnfKTabnRZt7EhyY18q71/8PHsywj066jnUIAny\nOK/KGgLtzQKBgCPSoSizh14CZOhKH/NpESqX+0HGNyCGu/zhMoqOzUMULn+pTfgf\nRBDAFn7my30ImiBtdwKWTiXfQtysqfsFLOX3CEuSRaVvDw0leBShLmgvby76Z8PJ\n+1tmTgomrLyaVSMfpiyTqTFovILX1BBlzwIORgRA7hCB5zXszqFlSa8/AoGAXNVb\nv4DBRzIzmwlte60TpO/kc7UBPa8SAITj7qITtUFEVcIoE3bF0kXX+dKNx9Ws3R5R\n2Az5ELq5XnhmM1i7H4tVwIskXbQKGG1KfzzhOxoqJC4Z4Visgyn5bVUtyXF3+IfQ\n06KdlzNrCpfF8hNHq1n3K+aiQSVdt96Po4oORvECgYAYOCjTMjViWanNOQF6UoxR\nktfp+MJWvdw3rTsOSTpBjS+uznUQplmYRUBcew+iXvklTEJaDA9lk1D7cNCCYbTg\nVMkyHDQTsoUJOFAZ5+yGVG3Q0styhmtYkes9OvTPgo4bnDFnR2tRpQ8n5rw9G35X\np7XFz4cDobYsn0Jj2hCgzw==\n-----END PRIVATE KEY-----\n",
        SCOPE
    );
    await jwtClient.authorize();
    return jwtClient;
}
const auth2 = async () => {
    const oAuth2Client = new google.auth.OAuth2(
        "709452327599-ks9gb4i9hf9f9nungnfhl2u2pqc67iic.apps.googleusercontent.com",
        "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",
        "http://localhost:4200");
    await oAuth2Client.setCredentials({
        type: "service_account",
        project_id: "dev-app-416610",
        private_key_id: "9a0218367e7d5152058fe158541e606fd81a9982",
        private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCye9lJTh2Y7TiL\nk6czJ3V4pkADCM4EF0O/2FE3PMqgDoHVzPJ8l0o5SCPEnVIejVKMj2FtDmNfqXok\nqby7IwRyEtQ/tpna0TY108rMGggs8FX2f81o4rGlq4cJaREfeaGD1KLa3JdMnlPP\nkRya1NRdXkiAaOAR7bvBsPbzZoLdxrsSNhRRF0XeY7lQAbVpuKD7a+UdFUuGQqQl\nwJGMDhnkYkfRELUPYPiP45jPRusRLm8R2y+Scn8/5CWfsC6lOufOFCS7hHFWwCYB\nsMga4mRpv9LryGjlaH1s6UeYMbjsmUQxyOrc6i4MsMiHe0aggAwhWnCBqexc8Sob\nUqbHguvXAgMBAAECggEADae4Cgm17ftINjWHtzwvmpltkE3eJSX6gvTz0bwO7Ivv\nlwHlE28nuJYyVlqK69d4F1To6UUOiUUYGTH7RH37WxbhsjYwMzOKaDfZ7h+XvIhu\nqzs/5eRiHwCuhiPJsZTGrKVaCFCUKsJ6OwkpHRdnX/VUqq5bZkO/96OoYRrYrErl\nU2IgFcL3NFeKOmQdhjKkBS2Qzq8andmn7rf/eS9TButkIBywX8m49NrRsFvzTAb2\nt1M25+J1IvuJ1qKL2YKM2ug6NYatyqTKWZLJHYtsi3/WD27XVdlQZ8x/SjJHiim0\nhBsLIamU/K6p0lq/mi5dtHnPF0u301QPG7NEsyickQKBgQDX9iHxFhEh+bXiWkrH\nxALRYG3flZSKUqsw/G4z+wDeVeV68bJ2qxxUZyBbHhTEHgdTDB1Lyaqdq2HwNgld\nchergUQYFJA03D2b1dRLqzOImndC5IkzTpwRRuR7abtcjHyPkpNHs9ZkCLYR88aj\n5bSX35kyrQt0ft/yJ1b4iHe8MwKBgQDTkvesyLRmTYMgfEiMHMRMznqZ/Y0lbchf\no3Qny1FvHJvkSDKdvetbBB17aTlRVAu0dskcTKR/X/zORMTQYUXVZZI2ojYieVth\nGld/lb56Pl02Tq5FLWI1+KJN1LnfKTabnRZt7EhyY18q71/8PHsywj066jnUIAny\nOK/KGgLtzQKBgCPSoSizh14CZOhKH/NpESqX+0HGNyCGu/zhMoqOzUMULn+pTfgf\nRBDAFn7my30ImiBtdwKWTiXfQtysqfsFLOX3CEuSRaVvDw0leBShLmgvby76Z8PJ\n+1tmTgomrLyaVSMfpiyTqTFovILX1BBlzwIORgRA7hCB5zXszqFlSa8/AoGAXNVb\nv4DBRzIzmwlte60TpO/kc7UBPa8SAITj7qITtUFEVcIoE3bF0kXX+dKNx9Ws3R5R\n2Az5ELq5XnhmM1i7H4tVwIskXbQKGG1KfzzhOxoqJC4Z4Visgyn5bVUtyXF3+IfQ\n06KdlzNrCpfF8hNHq1n3K+aiQSVdt96Po4oORvECgYAYOCjTMjViWanNOQF6UoxR\nktfp+MJWvdw3rTsOSTpBjS+uznUQplmYRUBcew+iXvklTEJaDA9lk1D7cNCCYbTg\nVMkyHDQTsoUJOFAZ5+yGVG3Q0styhmtYkes9OvTPgo4bnDFnR2tRpQ8n5rw9G35X\np7XFz4cDobYsn0Jj2hCgzw==\n-----END PRIVATE KEY-----\n",
        client_email: "displate@dev-app-416610.iam.gserviceaccount.com",
        client_id: "111093369291637551338",
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/displate%40dev-app-416610.iam.gserviceaccount.com",
        universe_domain: "googleapis.com"
    });
    return oAuth2Client
}
const authG = async () => {
    const auth = new google.auth.GoogleAuth({
        keyFile: KEYFILEPATH,
        scopes: SCOPE,
    });
    return auth
}
export const uploadToDrive = async (file) => {
    try {
        const authJWTClient = await authJWT();
        // const auth2Client = await auth2();
        // const authGClient = await authG();

        const bufferStream = new stream.PassThrough();
        bufferStream.end(file.buffer);
        const service = await google.drive({ version: "v3", auth: authJWTClient });

        let data = await service.files.create({
            media: {
                mimeType: file.mimetype,
                body: bufferStream,
            },
            requestBody: {
                name: file.originalname,
                parents: ['19dqf-r4-TIxGlK4grbJduTCy0PZEV4KP'],
            },
            fields: "id,name",
        });
        return data;
    } catch (err) {
        throw err;
    }
}