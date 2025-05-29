import { Request } from "express";
import multer, { StorageEngine, FileFilterCallback } from "multer";
import path from "path";

// Configuração do destino das imagens
const imageStorage: StorageEngine = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    let folder = "";

    if (req.baseUrl.includes("users")) {
      folder = "users";
    }

    cb(null, `public/img/${folder}`);
  },
  filename: (req: Request, file, cb) => {
    cb(
      null,
      `${Date.now()}-${Math.floor(Math.random() * 1000)}${path.extname(file.originalname)}`
    );
  }
});

// Filtro para aceitar apenas .png e .jpg
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (!file.originalname.match(/\.(png|jpg)$/i)) {
    return cb(new Error("Por favor, envie apenas arquivos .jpg ou .png"));
  }
  cb(null, true);
};

// Configuração do Multer
const imageUpload = multer({
  storage: imageStorage,
  fileFilter
});

export { imageUpload };
