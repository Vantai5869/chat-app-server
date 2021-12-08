import config from './../config/config';
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const path = require("path")

const uploadToCloudinary=async (req, res) => {
    if (req.files === null) {
        return res.status(400).json({ msg: 'No file uploaded' });
      }
      let fileType =req.files.file.mimetype
      let fileExt=''
      switch (fileType) {
          case 'audio/ogg':{
            fileType= 'video'
            break
          }     
          case 'audio/mpeg':{
            fileType= 'video'
            break
          }             
          case 'audio/wav':{
            fileType= 'video'
            break
          }          
          case 'video/mp4':{
            fileType= 'video'
            break
          }
          case 'image/png':{
            fileType= 'image'
            break
          } 
          case 'image/jpeg':{
            fileType= 'image'
            break
          }          
          case 'image/gif':{
            fileType= 'image'
            break
          } 
          case 'text/plain':{
            fileType= 'raw'
            fileExt='.txt'
            break
          }
          default: fileType= 'raw'
      }

      try {
        fs.mkdirSync(path.join(__dirname, '../../public/file-upload/'))
      } catch (err) {
        if (err.code !== 'EEXIST') throw err
      }
      
      const file = req.files.file;
      const filepath =path.join(__dirname,`../../public/file-upload/${file.name}${fileExt}`)

    try {
        const fileMvRespon= file.mv(filepath, err => {
            if (err) {
              console.error(err);
              return res.status(500).send(err);
            }

            cloudinary.config({
                cloud_name: config.CLOUDINARY.CLOUDINARY_NAME,
                api_key: config.CLOUDINARY.CLOUDINARY_KEY,
                api_secret: config.CLOUDINARY.CLOUDINARY_SECRET,
            });

            cloudinary.uploader.upload(
                filepath, {
                    resource_type: fileType,
                    public_id: `VideoUploads/${file.name}`,
                    // chunk_size: 6000000,
                    timeout:120000,
                    eager: [
                        {
                            width: 600,
                            height: 600,
                            crop: "pad",
                            audio_codec: "none",
                        },
                        // {
                        //     width: 160,
                        //     height: 100,
                        //     crop: "crop",
                        //     gravity: "south",
                        //     audio_codec: "none",
                        // },
                    ],
                },
                
                (err, video) => {
                    if(err){
                        return res.json({
                            success: false,
                            err
                        });
                    }
                    console.log("err2", err)
                    if (err) return res.send(err);
                    fs.unlinkSync(filepath);
                    console.log("video", video)
                    return res.json({
                        success: true,
                        url: video.url,
                        smallUrl: video.eager[0].url
                    });
                }
            );

        });
    } catch (error) {
        return res.json({
            success: false,
            error
        });
    }
}

export default {
    uploadToCloudinary
 };
