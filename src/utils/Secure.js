import forge from 'node-forge'

export const code = (container) => {
    if (container) {
        const iv = forge.random.getBytesSync(16); 
        const cipher = forge.cipher.createCipher('AES-CBC', forge.util.createBuffer(keyHolder()));
        cipher.start({ iv: iv });
        cipher.update(forge.util.createBuffer(container, 'utf8'));
        cipher.finish();
        const encrypted = forge.util.encode64(iv + cipher.output.getBytes());
        return encrypted;
    }
}


export const decode = (container) => {
    if (container) {
        const encryptedBytes = forge.util.decode64(container);
        const iv = encryptedBytes.slice(0, 16); 
        const encrypted = encryptedBytes.slice(16); 
        const decipher = forge.cipher.createDecipher('AES-CBC', forge.util.createBuffer(keyHolder()));
        decipher.start({ iv: forge.util.createBuffer(iv) });
        decipher.update(forge.util.createBuffer(encrypted));
        const success = decipher.finish();
        return success ? decipher.output.toString('utf8') : 'Decryption failed';
    }
}

export const keyHolder = () => {
    const key = forge.util.createBuffer(forge.pkcs5.pbkdf2(import.meta.env.VITE_SECRET_KEY, import.meta.env.VITE_HEX_KEY, 10000, 32));
    return key
}