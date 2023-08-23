const { Advertisement } = require("../../models/Advertisement");
var fs = require("fs");

const Add_ = (request, response) => {
    let { title, url,description,description2,cta_text ,status } = request.body;
    if (title === undefined || status === undefined)
        response.status(400).json({ message: "title,status,image requied" });
    else if (!request?.files || !request?.files?.image)
        response
            .status(400)
            .json({ message: "title,status,image requied" });
    else {
        let validExt = ["jpg", "jpeg", "png"];
        let { size, name, md5 } = request.files.image;
        let img = request.files.image;
        let ext = name.split(".").at(-1);
        if (size > 7000000)
            response.status(400).json({ message: "image size less than 7mb" });
        else if (!validExt.includes(ext))
            response.status(400).json({ message: "invalid image type" });
        else {
            let fname = md5 + "__" + Date.now() + "." + ext;
            // var uploadPath = __dirname + "/../../uploads/" + fname;
            // img.mv(uploadPath);
            let advertise = new Advertisement();
            advertise.image = fname;
            advertise.title = title;
            advertise.status = status;
            advertise.url = url ? url : null;
            advertise.description = description;
            advertise.description2 = description2;
            advertise.cta_text = cta_text;

 
                advertise.save();
                response.status(200).json(advertise);

    
        
            
        }
    }
};

const Update_ = (request, response) => {
    Advertisement.findById(request.params.id)
        .then((data) => {
            if (data == null)
                response.status(400).json({ message: "invalid id" });
            else {
                let { title, url, status } = request.body;
                if (title && title != data.title) data.title = title;
                if (url && url != data.url) data.url = url;
                if (status != undefined || status != data.status)
                    data.status = status;
                if (request.files && request.files.image) {
                    let validExt = ["jpg", "jpeg", "png"];
                    let { size, name, md5 } = request.files.image;
                    let img = request.files.image;
                    let ext = name.split(".").at(-1);
                    if (size > 7000000)
                        response
                            .status(400)
                            .json({ message: "image size less than 7 mb" });
                    else if (!validExt.includes(ext))
                        response
                            .status(400)
                            .json({ message: "invalid image type" });
                    else {
                        let fname = md5 + "__" + Date.now() + "." + ext;
                        var uploadPath = __dirname + "/../../uploads/" + fname;
                        img.mv(uploadPath);
                        var filePath =
                            __dirname + "/../../uploads/" + data.image;
                        fs.unlinkSync(filePath);
                        data.image = fname;
                    }
                }

                data.save()
                    .then((temp) => {
                        response
                            .status(200)
                            .json({ message: "data updated", data });
                    })
                    .catch((err) => {
                        response
                            .status(500)
                            .json({ message: "internal server error" });
                    });
            }
        })
        .catch((err) => {
            response.status(404).json({ message: "invalid id" });
        });
};

/**
 *Fetch Corresponding record from database by record id
 */

const Find_ = (request, response) => {
    Advertisement.findById(request.params.id)
        .then((data) => {
            if (data == null)
                response.status(400).json({ message: "invalid id" });
            else response.status(200).json(data);
        })
        .catch((err) => {
            response.status(404).json({ message: "invalid id" });
        });
};

/**
 *Fetch all The data from database
 */

const FindAll_ = (request, response) => {
    Advertisement.find()
        .then((data) => {
            if (data.length == 0)
                response.status(404).json({ message: "no data found" });
            else response.status(200).json(data);
        })
        .catch((err) => {
            response.status(500).json({ message: "internal server error" });
        });
};

/**
 *Delete Data from Database and files from Storge
 */

const Remove_ = (request, response) => {
    Advertisement.findByIdAndDelete(request.params.id)
        .then((data) => {
            if (data === null)
                response.status(400).json({ message: "invalid id" });
            else {
                var filePath = __dirname + "/../../uploads/" + data.image;
                fs.unlinkSync(filePath);
                response.status(202).json({ message: "data removed" });
            }
        })
        .catch((err) => {
            response.status(400).json({ message: "invalid id" });
        });
};

module.exports = { Find_, FindAll_, Add_, Update_, Remove_ };
