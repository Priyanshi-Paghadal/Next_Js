/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import multer from "multer";
// import path from "path";
// import { NextApiRequest, NextApiResponse } from "next";

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// // Set up multer storage
// const storage = multer.diskStorage({
//   destination: path.join(process.cwd(), "/public/uploads"),
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage });

// const uploadMiddleware = upload.single("file");

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   await new Promise((resolve, reject) => {
//     uploadMiddleware(req as any, res as any, (err: any) => {
//       if (err) return reject(err);
//       resolve(null);
//     });
//   });

//   const file = (req as any).file;
//   const body = (req as any).body;

//   if (!file) {
//     return res.status(400).json({ message: "No file uploaded" });
//   }

//   return res.status(200).json({
//     message: "File uploaded successfully",
//     file,
//     body,
//   });
// }

// import multer from "multer";
// import path from "path";

// Set up multer storage
// const storage = multer.diskStorage({
//   destination: path.join(process.cwd(), "/public/uploads"),
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage });

// const uploadMiddleware = upload.single("file");

// export const uploadFile = (req: any, res: any): Promise<any> => {
//   return new Promise((resolve, reject) => {
//     uploadMiddleware(req, res, (err: any) => {
//       if (err) return reject(err);
//       resolve(null);
//     });
//   });
// };

// export const processUploadedFile = (req: any) => {
//   const file = req.file;
//   if (!file) {
//     throw new Error("No file uploaded");
//   }

//   return {
//     message: "File uploaded successfully",
//     file,
//     body: req.body,
//   };
// };


// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   try {
//     // Upload file using the uploadService
//     await uploadFile(req, res);

//     // Process the uploaded file and return a response
//     const response = processUploadedFile(req);

//     return res.status(200).json(response);
//   } catch (error) {
//     // Handle errors (e.g., no file uploaded)
//     return res.status(400).json({ message: error});
//   }
// }
export const uploadFile = (req: any, res: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    uploadMiddleware(req, res, (err: any) => {
      if (err) return reject(err);
      resolve(null);
    });
  });
};

export const processUploadedFile = (req: any) => {
  const file = req.file;
  if (!file) {
    throw new Error("No file uploaded");
  }

  return {
    message: "File uploaded successfully",
    file,
    body: req.body,
  };
};

function uploadMiddleware(_req: any, res: any, arg2: (err: any) => void) {
  throw new Error("Function not implemented.");
}
