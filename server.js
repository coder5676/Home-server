const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const multer=require('multer');
const fs=require('fs');
const qrcode=require('qrcode');
const os = require('os');


const uploadsdir=path.join(__dirname,"uploads")
if(!fs.existsSync(uploadsdir)){
  fs.mkdirSync(uploadsdir);
}
const storage = multer.diskStorage(
  {
    destination:(req,res,cb)=>{
      cb(null,'uploads/');
    },

    filename:(req,file,cb)=>{
      const uniquename=`${Date.now()}-${file.originalname}`;
      cb(null,uniquename)
    }
  }
)

const upload= multer({storage});
app.post("/upload",upload.single("file"),(req,res)=>{
  if(!req.file){
    return res.status(400).json({error:"No file uploaded"})
  }

  const file=req.file;
  const metadata={
    originalname:file.originalname,
    filename:file.filename,
    category:req.body.category,
    mimetype:file.mimetype,
    size:file.size,
    path:`/files/${file.filename}`,
    uploadtime:new Date().toISOString()
  }

  const metadatafile=path.join(__dirname,"metadata.json");
  let existing=[];
  if(fs.existsSync(metadatafile)){
    existing=JSON.parse(fs.readFileSync(metadatafile))
  }
  existing.push(metadata);
  fs.writeFileSync(metadatafile,JSON.stringify(existing,null,2));
  res.json({message:"file uploaded successfully"})

}
)

app.get("/files/list", (req, res) => {
  const metadataFile = path.join(__dirname, "metadata.json");
  if (!fs.existsSync(metadataFile)) return res.json([]);
  const data = fs.readFileSync(metadataFile);
  res.json(JSON.parse(data));
});

  function getIPv4() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return '127.0.0.1';
}


app.use("/files", express.static(path.join(__dirname, "uploads")));
app.use("/filenest",express.static(path.join(__dirname,"public")));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'port.html'));
});

app.get("/serverinfo", async (req, res) => {
  const ipv4 = getIPv4(); // ✅ DEFINE IT FIRST
  const appurl = `http://${ipv4}:${port}/filenest/`;
 

  try {
    const qr = await qrcode.toDataURL(appurl);
    res.json({
      ip: ipv4,
      port: port,
      status: "Running",
      qr
    });
  } catch (error) {
    console.error("QR generation failed", error);
    res.status(500).json({ error: "Failed to generate QR code" });
  }
});



app.listen(port,"0.0.0.0", () => {
  console.log(`Example app listening on port ${port}`)
})
