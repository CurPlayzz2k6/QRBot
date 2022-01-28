import {
    createRequire
} from "module";
const require = createRequire(
    import.meta.url);
const {
    Client,
    MessageEmbed,
    MessageAttachment
} = require('discord.js');
const Discord = require('discord.js');
const Canvas = require('canvas');
Canvas.registerFont('default.ttf', {
    family: 'default'
});
const Database = require('@replit/database');
const pagination = require('discord.js-pagination');
//encoder
const {
    Encoder,
} = require('@nuintun/qrcode');
const urlExists = require('url-exists');
const morse = require('morse-node').create();
import fetch from 'node-fetch';
const client = new Client();
var ok = {
    oke: false
};
const db = new Database();

client.on("ready", () => {
    const activities = [
        "mã QR",
        "thông tin COVID-19",
        "trợ giúp với /chelp",
        "thông tin thành viên"
    ];
    setInterval(() => {
        const randomIndex = randomIntFromInterval(0, 10000) % 4;
        const newActivity = activities[randomIndex];
        client.user.setActivity(newActivity, {
            type: "WATCHING"
        });
    }, 15000);
    console.log(`Ready!!!`)
})

var p = -1;
var tg;
var name = new Array();
var point = new Array();
var display = new Array();
var id = new Array();
p = -1;
name = new Array();
point = new Array();
display = new Array();
id = new Array();
db.list().then((keys) => {
    for (let key of keys) {
        ok.oke = false;
        db.get(key).then(value => {
            p++;
            id[p] = key;
            name[p] = `<@!${key}>`;
            point[p] = parseInt(value);
            display[p] = `${name[p]} - **${point[p]} điểm bủh**`;
            for (let i = 0; i <= p - 1; i++) {
                for (let j = i + 1; j <= p; j++) {
                    if (point[i] < point[j]) {
                        tg = point[i];
                        point[i] = point[j];
                        point[j] = tg;
                        tg = id[i];
                        id[i] = id[j];
                        id[j] = tg;
                        tg = name[i];
                        name[i] = name[j];
                        name[j] = tg;
                        tg = display[i];
                        display[i] = display[j];
                        display[j] = tg;
                    }
                }
            }
        });
    };
    ok.oke = true;
});
setInterval(() => {
    p = -1;
    name = new Array();
    point = new Array();
    display = new Array();
    id = new Array();
    db.list().then((keys) => {
        for (let key of keys) {
            ok.oke = false;
            db.get(key).then(value => {
                p++;
                id[p] = key;
                name[p] = `<@!${key}>`;
                point[p] = parseInt(value);
                display[p] = `${name[p]} - **${point[p]} điểm bủh**`;
                for (let i = 0; i <= p - 1; i++) {
                    for (let j = i + 1; j <= p; j++) {
                        if (point[i] < point[j]) {
                            tg = point[i];
                            point[i] = point[j];
                            point[j] = tg;
                            tg = id[i];
                            id[i] = id[j];
                            id[j] = tg;
                            tg = name[i];
                            name[i] = name[j];
                            name[j] = tg;
                            tg = display[i];
                            display[i] = display[j];
                            display[j] = tg;
                        }
                    }
                }
            });
        };
        ok.oke = true;
    });
}, 1000 * 15);

client.on("message", async (message) => {
    if (!message.author.bot) {
        db.get(message.author.id).then(value => {
            if (value == undefined) db.set(message.author.id, 1).then(() => {});
            else db.set(message.author.id, parseInt(value) + 1).then(() => {});
        });
    }
    if (message.attachments.size > 0) {
        if (message.content.trim().startsWith('<@!893477335989366804>')) {
            message.attachments.forEach(async (attachment) => {
                const step1 = `http://zxing.org/w/decode?u=${attachment.proxyURL}&full=true%20(code%20URL%20unescaped:%20${attachment.proxyURL})`;
                const result = await fetch(step1);
                const contents = await result.text();
                const content = contents.trim();
                urlExists(content, function(err, exists) {
                    if (isValidQR(content)) {
                        const embed = new MessageEmbed()
                            .setColor("RANDOM")
                            .setTimestamp()
                            .setAuthor("Hệ thống quét mã QR tự động", message.author.displayAvatarURL(), message.author.displayAvatarURL())
                            .setTitle("Đã quét thành công")
                            .setThumbnail(message.author.displayAvatarURL())
                            .setImage(`https://api.apiflash.com/v1/urltoimage?access_key=e64c3b625f274989be99e729c87dfdb3&url=${content.trim()}`)
                            .setFooter(`Tin nhắn này gửi đến ${message.author.username}`);
                        if (exists == true) {
                            embed.addFields({
                                name: "Người gửi:",
                                value: `\`${message.author.username}\``
                            }, {
                                name: "Phân loại:",
                                value: `\`URL\``
                            }, {
                                name: "URL đã quét được từ mã QR:",
                                value: `\`${content.trim()}\``
                            });
                        } else {
                            if (checkMorse(content.trim()) && morse.isValid(content.trim(), "morse")) {
                                embed.addFields({
                                    name: "Người gửi:",
                                    value: `\`${message.author.username}\``
                                }, {
                                    name: "Phân loại:",
                                    value: `\`Mã Morse\``
                                }, {
                                    name: "Mã Morse đã quét được từ mã QR:",
                                    value: `\`${content.trim()}\``
                                }, {
                                    name: "Văn bản được giải mã từ mã Mosre trên:",
                                    value: `\`${morse.decode(content.trim() + "/").trim()}\``
                                });
                            } else {
                                embed.addFields({
                                    name: "Người gửi:",
                                    value: `\`${message.author.username}\``
                                }, {
                                    name: "Phân loại:",
                                    value: `\`Văn bản\``
                                }, {
                                    name: "Văn bản đã quét được từ mã QR:",
                                    value: `\`${content.trim()}\``
                                }, );
                            }
                        }
                        message.channel.send(embed);
                    } else {
                        const embed = new MessageEmbed()
                            .setColor("RANDOM")
                            .setTimestamp()
                            .setAuthor("Hệ thống quét mã QR tự động", message.author.displayAvatarURL(), message.author.displayAvatarURL())
                            .addFields({
                                name: "Có thể gặp những lỗi sau:",
                                value: `- Ảnh không chứa mã QR\n- Ảnh không có đuôi file là .png hoặc jpg\n- Ảnh lớn hơn 10MB\n- Ảnh chứa mã QR không có nội dung\n- Ảnh chụp chứa mã QR nhưng quá mờ hoặc quá tối`
                            })
                            .setTitle("Không thể quét mã QR")
                            .setThumbnail(message.author.displayAvatarURL())
                            .setFooter(`Tin nhắn này gửi đến ${message.author.username}`);
                        message.channel.send(embed);
                    }
                });
            });
        }
    }
    if (message.channel.type == 'dm' || !message.content.startsWith("/")) return;
    if (message.content.startsWith("/rank")) {
        let st = message.content;
        const args = st.split(" ");
        const enQr = new Encoder();
        const str = `MATMSG:TO:Rạq siếk Truq Ưn;SUB:Dưới đây là thông tin về thành viên;BODY:👋 Thông tin về ${message.author.username} 👋\n🎫 Tên: ${message.author.username}\n🆔 ID: ${message.author.id}\n#️⃣ Đề cập: ${message.author.tag}\n💬 Tham gia Discord lúc: ${message.author.createdAt.toLocaleDateString()}\n🤖 Đây phải BOT hay không: ${message.author.bot == true ? "Phải" : "Không"}\n🎟️ Thẻ thông tin được tạo bởi Rạq siếk Truq Ưn 🎟️;;`;
        enQr.write(str.trim());
        enQr.setErrorCorrectionLevel("H");
        enQr.make();
        const url = enQr.toDataURL();
        var canvas = {};
        canvas.create = Canvas.createCanvas(1024, 500);
        canvas.context = canvas.create.getContext('2d');
        canvas.context.fillStyle = hexBackground(args[1]);
        canvas.context.fillRect(0, 0, 1024, 500);
        canvas.context.fillStyle = hexShape(args[2]);
        canvas.context.arc(357, 250, 34, 0, Math.PI * 2, true);
        canvas.context.fill();
        roundRect(canvas, 390, 263, 297, 220, 100, true, false);
        roundRect(canvas, 697, 263, 297, 220, 100, true, false);
        roundRect(canvas, 30, 250, 220, 220, 100, true, false);
        roundRect(canvas, 390, 30, 604, 220, 100, true, false);
        canvas.context.arc(285, 290, 26, 0, Math.PI * 2, true);
        canvas.context.fill();
        await Canvas.loadImage("./default.png")
            .then(img => {
                canvas.context.drawImage(img, 678, 357.38, 284.75, 125.25);
            });
        await Canvas.loadImage(url)
            .then(img => {
                canvas.context.drawImage(img, 434, 294, 154, 154);
            });
        canvas.context.fillStyle = '#FF0000';
        canvas.context.font = '25px default';
        canvas.context.fillText(`*Đối với iOS:\nMã QR yêu cầu quyền truy cập\nMail để hiển thị thông tin`, 20, 40);
        canvas.context.font = '50px default';
        canvas.context.fillStyle = hexText(args[3]);
        canvas.context.fillText(`Tên: ${message.author.username}`, 440, 101);
        canvas.context.fillText(`Xếp hạng: ${getRank(message.author.id)}`, 440, 154);
        canvas.context.fillText(`Điểm Bủh: ${point[getRank(message.author.id) - 1]} điểm`, 440, 213);
        canvas.context.font = '30px default';
        canvas.context.fillText("*Mã\nQR\nthông\ntin", 600, 315);
        canvas.context.beginPath();
        canvas.context.arc(140, 361, 100, 0, Math.PI * 2, true);
        canvas.context.closePath();
        canvas.context.clip();
        await Canvas.loadImage(message.author.displayAvatarURL({
                format: 'jpg',
                size: 1024
            }))
            .then(img => {
                canvas.context.drawImage(img, 40, 261, 200, 200);
            });
        let atta = new MessageAttachment(canvas.create.toBuffer(), `${makeRand(100)}.png`)
        try {
            message.channel.send(atta);
        } catch (err) {
            console.log(err);
        }
    } else if (message.content.startsWith("/leaderboard") || message.content.startsWith("/lb")) {
        var pages = new Array();
        let i = 1;
        for (let i = 1; i <= Math.ceil(display.length / 10); i++)
            pages[i - 1] = new MessageEmbed()
            .setTimestamp()
            .setAuthor("Bảng xếp hạng Rạq Siếk Truq Ưn", message.author.displayAvatarURL())
            .setThumbnail(message.guild.iconURL())
            .setDescription(join(display, 10 * i - 10, 10 * i - 1, '\n') + "\n:warning: **Lưu ý:**\n• Chức năng chuyển trang sẽ bị vô hiệu trong 2 phút nữa\n• Bảng xếp hạng sẽ được cập nhật sau mỗi 15 giây\n• Nếu bảng xếp hạng trong quá trình cập nhật thì sẽ không hiển thị đầy đủ.");
        pagination(message, pages, ["⬅️", "➡️"], 120000);
    } else if (message.content.startsWith("/chelp")) {
        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTimestamp()
            .setThumbnail(message.author.displayAvatarURL())
            .setAuthor("Rạq Siếk Truq Ưn", message.author.displayAvatarURL(), message.author.displayAvatarURL())
            .addFields({
                name: "Tạo mã QR:",
                value: `\`/createqr [URL/Văn bản/Mã Morse]\` - Tạo mã QR với nội dung bạn muốn`
            }, {
                name: "Quét mã QR:",
                value: `\`/scanqr [URL]\` - Quét mã QR với URL chứa mã QR\n- Bạn cũng có thể đề cập đến` + ` **\`@CircusCloud\`** ` + `khi mà bạn gửi tệp phương tiện để quét tự động\n:warning: **Lưu ý**:\n- Hệ thống hạn chế bạn chỉ gửi 1 tệp phương tiện duy nhất khi sử dụng chức năng quét tự động`
            }, {
                name: "Thông tin thành viên trong Rạq siếk Truq Ưn:",
                value: `\`/leaderboard\` hoặc \`/lb\` - Bảng xếp hạng điểm bủh trong Rạq siếk Truq Ưn\n \`/rank\` - Cho biết thông tin thành viên`
            }, {
                name: "Thông tin về COVID-19 cập nhật theo từng ngày:",
                value: `\`/covid list\` - Cho biết danh sách các quốc gia bạn có thể xem thông tin\n\`/covid search [Tên quốc gia]\` - Cho biết thông tin về COVID-19 ở quốc gia đó`
            })
            .setTitle("Hệ thống trợ giúp")
            .setImage("https://i.ibb.co/QDcgG5X/Screenshot-2021-10-06-172542.png")
            .setFooter("Trên đây là ví dụ về cách sử dụng chức năng quét tự động")
        message.channel.send(embed);
    } else if (message.content.startsWith("/covid list")) {
        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTimestamp()
            .setAuthor("Danh sách 223 quốc gia có thể thống kê trên thế giới", message.author.displayAvatarURL(), message.author.displayAvatarURL());
        const step1 = `https://corona.lmao.ninja/v2/countries`;
        const result = await fetch(step1);
        const data = await result.json();
        var str = "";
        var isValid = false;
        data.forEach((element) => {
            str += "`" + element.country + "` ";
        });
        embed.setDescription(str);
        message.channel.send(embed);
    } else if (message.content.startsWith("/covid search")) {
        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTimestamp()
            .setAuthor("Thống kê về số lượng ca nhiễm và tử vong bởi COVID-19", message.author.displayAvatarURL(), message.author.displayAvatarURL());
        const step1 = `https://corona.lmao.ninja/v2/countries`;
        const result = await fetch(step1);
        const data = await result.json();
        var isValid = false;
        data.forEach((element) => {
            if (element.country.toLowerCase() == message.content.slice(14, message.content.length).toLowerCase()) {
                embed.addFields({
                    name: `Quốc gia: `,
                    value: `\`${element.country}\``
                });
                embed.addFields({
                    name: `Khu vực: `,
                    value: `\`${element.continent}\``
                });
                embed.addFields({
                    name: `Dân số:`,
                    value: `\`${element.population}\``
                });
                embed.addFields({
                    name: `Số ca nghi nhiễm:`,
                    value: `\`${element.cases}\``
                });
                embed.addFields({
                    name: `Số ca nghi nhiễm trong hôm nay:`,
                    value: `\`${element.todayCases}\``
                });
                embed.addFields({
                    name: `Số ca tử vong:`,
                    value: `\`${element.deaths}\``
                });
                embed.addFields({
                    name: `Số ca tử vong trong hôm nay:`,
                    value: `\`${element.todayDeaths}\``
                });
                embed.addFields({
                    name: `Số ca hồi phục:`,
                    value: `\`${element.recovered}\``
                });
                embed.addFields({
                    name: `Số ca hồi phục trong hôm nay:`,
                    value: `\`${element.todayRecovered}\``
                });
                embed.addFields({
                    name: `Số ca dương tính:`,
                    value: `\`${element.active}\``
                });
                embed.addFields({
                    name: `Số ca nguy kịch:`,
                    value: `\`${element.critical}\``
                });
                embed.addFields({
                    name: `Số lần xét nghiệm tối thiểu của một người:`,
                    value: `\`${element.oneTestPerPeople}\``
                });
                embed.addFields({
                    name: `Tổng số lượt xét nghiệm:`,
                    value: `\`${element.tests}\``
                });
                embed.setThumbnail(element.countryInfo.flag);
                isValid = true;
            }
            //embed.addFields({ name: element.country, value: `Số người nhiễm: ${element.cases} | Sô người tử vong: ${element.deaths}`})
        });
        if (isValid)
            message.channel.send(embed);
        else {
            embed.setAuthor("Tên quốc gia không tồn tại");
            message.channel.send(embed);
        }
    } else if (message.content.startsWith("/scanqr")) {
        const step1 = `http://zxing.org/w/decode?u=${message.content.slice(8, message.content.length)}&full=true%20(code%20URL%20unescaped:%20${message.content.slice(8, message.content.length)})`;
        const result = await fetch(step1);
        const content = await result.text();
        if (isValidQR(content)) {
            urlExists(content, function(err, exists) {
                if (exists == true) {
                    const embed = new MessageEmbed()
                        .setColor("RANDOM")
                        .setTimestamp()
                        .setThumbnail(message.author.displayAvatarURL())
                        .setAuthor("Hệ thống quét mã QR", message.author.displayAvatarURL(), message.author.displayAvatarURL())
                        .setImage(`https://api.apiflash.com/v1/urltoimage?access_key=e64c3b625f274989be99e729c87dfdb3&url=${content.trim()}`)
                        .addFields({
                            name: "Người gửi:",
                            value: `\`${message.author.username}\``
                        }, {
                            name: "Phân loại:",
                            value: `\`URL\``
                        }, {
                            name: "URL đã quét được từ mã QR:",
                            value: `\`${content.trim()}\``
                        })
                        .setTitle("Đã quét thành công");
                    message.channel.send(embed);
                } else {
                    if (checkMorse(content.trim()) && morse.isValid(content.trim(), "morse")) {
                        const embed = new MessageEmbed()
                            .setColor("RANDOM")
                            .setTimestamp()
                            .setThumbnail(message.author.displayAvatarURL())
                            .setAuthor("Hệ thống quét mã QR", message.author.displayAvatarURL(), message.author.displayAvatarURL())
                            .addFields({
                                name: "Người gửi:",
                                value: `\`${message.author.username}\``
                            }, {
                                name: "Phân loại:",
                                value: `\`Mã Morse\``
                            }, {
                                name: "Mã Morse đã quét được từ mã QR:",
                                value: `\`${content.trim()}\``
                            }, {
                                name: "Văn bản được giải mã từ mã Mosre trên:",
                                value: `\`${morse.decode(content.trim() + "/").trim()}\``
                            })
                            .setTitle("Đã quét thành công");
                        message.channel.send(embed);
                    } else {
                        const embed = new MessageEmbed()
                            .setColor("RANDOM")
                            .setTimestamp()
                            .setThumbnail(message.author.displayAvatarURL())
                            .setAuthor("Hệ thống quét mã QR", message.author.displayAvatarURL(), message.author.displayAvatarURL())
                            .addFields({
                                name: "Người gửi:",
                                value: `\`${message.author.username}\``
                            }, {
                                name: "Phân loại:",
                                value: `\`Văn bản\``
                            }, {
                                name: "Văn bản đã quét được từ mã QR:",
                                value: `\`${content.trim()}\``
                            }, )
                            .setTitle("Đã quét thành công");
                        message.channel.send(embed);
                    }
                }
            });
        } else {
            const embed = new MessageEmbed()
                .setColor("RANDOM")
                .setTimestamp()
                .setAuthor("Hệ thống quét mã QR", message.author.displayAvatarURL(), message.author.displayAvatarURL())
                .addFields({
                    name: "Có thể gặp những lỗi sau:",
                    value: `- Không nhập đúng cú pháp \`/scanqr [URL chứa mã QR]\`\n- URL không chứa mã QR\n- URL chứa hình ảnh lớn hơn 10MB\n- URL chứa mã QR không có nội dung\n- URL chứa hình chụp mã QR nhưng quá mờ hoặc quá tối`
                })
                .setTitle("Không thể quét mã QR");
            message.channel.send(embed);
        }
    } else if (message.content.startsWith("/createqr")) {
        if (message.content.slice(10, message.content.length) == "" || message.content.slice(10, message.content.length) == " ") {
            const embed = new MessageEmbed()
                .setColor("RANDOM")
                .setTimestamp()
                .setThumbnail(message.author.displayAvatarURL())
                .setAuthor("Hệ thống tạo mã QR", message.author.displayAvatarURL(), message.author.displayAvatarURL())
                .addFields({
                    name: "Cú pháp:",
                    value: `\`/createqr [URL/Văn bản/Mã Morse]\``,
                    inline: true
                })
                .setTitle("Vui lòng nhập đúng cú pháp");
            message.channel.send(embed);
        } else {
            urlExists(message.content.slice(10, message.content.length), function(err, exists) {
                if (exists == true) {
                    const enQr = new Encoder();
                    enQr.write(message.content.slice(10, message.content.length).trim());
                    enQr.setErrorCorrectionLevel("H");
                    enQr.make();
                    const randomName = makeRand(100) + '.png';
                    const image = enQr.toDataURL().split(",").slice(1).join(",");
                    const imageStream = new Buffer.from(image, 'base64');
                    const attachment = new MessageAttachment(imageStream, randomName);
                    const embed = new MessageEmbed()
                        .attachFiles([attachment])
                        .setImage(`attachment://${randomName}`)
                        .setColor("RANDOM")
                        .setTimestamp()
                        .setThumbnail(message.author.displayAvatarURL())
                        .setAuthor("Hệ thống tạo mã QR", message.author.displayAvatarURL(), message.author.displayAvatarURL())
                        .addFields({
                            name: "Người gửi:",
                            value: `\`${message.author.username}\``
                        }, {
                            name: "Phân loại:",
                            value: `\`URL\``
                        }, {
                            name: "URL đã được tạo mã QR:",
                            value: `\`${message.content.slice(10, message.content.length).trim()}\``
                        }, {
                            name: "══════════════════",
                            value: "**Mã QR cho URL trên:**"
                        })
                        .setTitle("Đã tạo thành công");
                    message.channel.send(embed);
                } else {
                    if (checkMorse(message.content.slice(10, message.content.length).trim()) && morse.isValid(message.content.slice(10, message.content.length).trim(), "morse")) {
                        const enQr = new Encoder();
                        enQr.write(morse.decode(message.content.slice(10, message.content.length)).trim());
                        enQr.setErrorCorrectionLevel("H");
                        enQr.make();
                        const randomName = makeRand(100) + '.png';
                        const image = enQr.toDataURL().split(",").slice(1).join(",");
                        const imageStream = new Buffer.from(image, 'base64');
                        const attachment = new MessageAttachment(imageStream, randomName);
                        const embed = new MessageEmbed()
                            .attachFiles([attachment])
                            .setImage(`attachment://${randomName}`)
                            .setColor("RANDOM")
                            .setTimestamp()
                            .setThumbnail(message.author.displayAvatarURL())
                            .setAuthor("Hệ thống tạo mã QR", message.author.displayAvatarURL(), message.author.displayAvatarURL())
                            .addFields({
                                name: "Người gửi:",
                                value: `\`${message.author.username}\``
                            }, {
                                name: "Phân loại:",
                                value: `\`Mã Morse\``
                            }, {
                                name: "Văn bản gốc:",
                                value: `\`${message.content.slice(10, message.content.length).trim()}\``
                            }, {
                                name: "Văn bản được giải mã từ mã Mosre trên:",
                                value: `\`${morse.decode(message.content.slice(10, message.content.length)).trim()}\``
                            }, {
                                name: "══════════════════",
                                value: "**Mã QR cho văn bản giải mã trên:**"
                            })
                            .setTitle("Đã tạo thành công");
                        message.channel.send(embed);
                    } else {
                        const enQr = new Encoder();
                        enQr.write(message.content.slice(10, message.content.length).trim());
                        enQr.setErrorCorrectionLevel("H");
                        enQr.make();
                        const randomName = makeRand(100) + '.png';
                        const image = enQr.toDataURL().split(",").slice(1).join(",");
                        const imageStream = new Buffer.from(image, 'base64');
                        const attachment = new MessageAttachment(imageStream, randomName);
                        const embed = new MessageEmbed()
                            .attachFiles([attachment])
                            .setImage(`attachment://${randomName}`)
                            .setColor("RANDOM")
                            .setTimestamp()
                            .setThumbnail(message.author.displayAvatarURL())
                            .setAuthor("Hệ thống tạo mã QR", message.author.displayAvatarURL(), message.author.displayAvatarURL())
                            .addFields({
                                name: "Người gửi:",
                                value: `\`${message.author.username}\``
                            }, {
                                name: "Phân loại:",
                                value: `\`Văn bản\``
                            }, {
                                name: "Văn bản đã được tạo mã QR:",
                                value: `\`${message.content.slice(10, message.content.length).trim()}\``
                            }, {
                                name: "══════════════════",
                                value: "**Mã QR cho văn bản trên:**"
                            })
                            .setTitle("Đã tạo thành công");
                        message.channel.send(embed);
                    }
                }
            });
        }
    }
});

function hexBackground(color) {
    if (!color) return "#d8f1ec";
    if (color.length != 7 && color.length != 9) return "#D8F1EC";
    if (color.length == 7) {
        for (let i = 1; i <= 6; i++) {
            if (color[i].toLowerCase() != '0' && color[i].toLowerCase() != 'a' && color[i].toLowerCase() != 'b' && color[i].toLowerCase() != 'c' && color[i].toLowerCase() != 'd' && color[i].toLowerCase() != 'e' && color[i].toLowerCase() != 'f' && color[i].toLowerCase() != '1' && color[i].toLowerCase() != '2' && color[i].toLowerCase() != '3' && color[i].toLowerCase() != '4' && color[i].toLowerCase() != '5' && color[i].toLowerCase() != '6' && color[i].toLowerCase() != '7' && color[i].toLowerCase() != '8' && color[i].toLowerCase() != '9')
                return "#d8f1ec";
        }
    } else {
        for (let i = 1; i <= 8; i++) {
            if (color[i].toLowerCase() != '0' && color[i].toLowerCase() != 'a' && color[i].toLowerCase() != 'b' && color[i].toLowerCase() != 'c' && color[i].toLowerCase() != 'd' && color[i].toLowerCase() != 'e' && color[i].toLowerCase() != 'f' && color[i].toLowerCase() != '1' && color[i].toLowerCase() != '2' && color[i].toLowerCase() != '3' && color[i].toLowerCase() != '4' && color[i].toLowerCase() != '5' && color[i].toLowerCase() != '6' && color[i].toLowerCase() != '7' && color[i].toLowerCase() != '8' && color[i].toLowerCase() != '9')
                return "#d8f1ec";
        }
    }
    return color;
}

function hexShape(color) {
    if (!color) return "#7fc6b6";
    if (color.length != 7 && color.length != 9) return "#7FC6B6";
    if (color.length == 7) {
        for (let i = 1; i <= 6; i++) {
            if (color[i].toLowerCase() != '0' && color[i].toLowerCase() != 'a' && color[i].toLowerCase() != 'b' && color[i].toLowerCase() != 'c' && color[i].toLowerCase() != 'd' && color[i].toLowerCase() != 'e' && color[i].toLowerCase() != 'f' && color[i].toLowerCase() != '1' && color[i].toLowerCase() != '2' && color[i].toLowerCase() != '3' && color[i].toLowerCase() != '4' && color[i].toLowerCase() != '5' && color[i].toLowerCase() != '6' && color[i].toLowerCase() != '7' && color[i].toLowerCase() != '8' && color[i].toLowerCase() != '9')
                return "#7fc6b6";
        }
    } else {
        for (let i = 1; i <= 8; i++) {
            if (color[i].toLowerCase() != '0' && color[i].toLowerCase() != 'a' && color[i].toLowerCase() != 'b' && color[i].toLowerCase() != 'c' && color[i].toLowerCase() != 'd' && color[i].toLowerCase() != 'e' && color[i].toLowerCase() != 'f' && color[i].toLowerCase() != '1' && color[i].toLowerCase() != '2' && color[i].toLowerCase() != '3' && color[i].toLowerCase() != '4' && color[i].toLowerCase() != '5' && color[i].toLowerCase() != '6' && color[i].toLowerCase() != '7' && color[i].toLowerCase() != '8' && color[i].toLowerCase() != '9')
                return "#7fc6b6";
        }
    }
    return color;
}

function hexText(color) {
    if (!color) return "#ffffff";
    if (color.length != 7 && color.length != 9) return "#FFFFFF";
    if (color.length == 7) {
        for (let i = 1; i <= 6; i++) {
            if (color[i].toLowerCase() != '0' && color[i].toLowerCase() != 'a' && color[i].toLowerCase() != 'b' && color[i].toLowerCase() != 'c' && color[i].toLowerCase() != 'd' && color[i].toLowerCase() != 'e' && color[i].toLowerCase() != 'f' && color[i].toLowerCase() != '1' && color[i].toLowerCase() != '2' && color[i].toLowerCase() != '3' && color[i].toLowerCase() != '4' && color[i].toLowerCase() != '5' && color[i].toLowerCase() != '6' && color[i].toLowerCase() != '7' && color[i].toLowerCase() != '8' && color[i].toLowerCase() != '9')
                return "#ffffff";
        }
    } else {
        for (let i = 1; i <= 8; i++) {
            if (color[i].toLowerCase() != '0' && color[i].toLowerCase() != 'a' && color[i].toLowerCase() != 'b' && color[i].toLowerCase() != 'c' && color[i].toLowerCase() != 'd' && color[i].toLowerCase() != 'e' && color[i].toLowerCase() != 'f' && color[i].toLowerCase() != '1' && color[i].toLowerCase() != '2' && color[i].toLowerCase() != '3' && color[i].toLowerCase() != '4' && color[i].toLowerCase() != '5' && color[i].toLowerCase() != '6' && color[i].toLowerCase() != '7' && color[i].toLowerCase() != '8' && color[i].toLowerCase() != '9')
                return "#ffffff";
        }
    }
    return color;
}

function getRank(playerID) {
    for (let i = 0; i <= p; i++) {
        if (playerID == id[i]) {
            return i + 1;
        }
    }
    return "Trống";
}

function join(arr, begin, end, ch) {
    var str = "";
    if (end + 1 > arr.length) end = arr.length - 1;
    for (let i = begin; i <= end; i++) {
        str += `**#${i + 1}.** ` + arr[i] + ch;
    }
    return str;
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function roundRect(cts, x, y, width, height, radius, fill, stroke) {
    var ctx = cts.context;
    if (typeof stroke == "undefined") {
        stroke = true;
    }
    if (typeof radius === "undefined") {
        radius = 5;
    }
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (stroke) {
        ctx.stroke();
    }
    if (fill) {
        ctx.fill();
    }
}

function isValidQR(str) {
    if ((str.search(`No barcode was found in this image. Either it did not contain a barcode, or did not contain one in a supported format, or the software was simply unable to find it. Go "Back" in your browser and try another image`) != -1 ||
            str.search(`You didn't specify a URL, or the URL was not valid, or did not return an image. Go "Back" in your browser and try again.`) != -1 ||
            str.search(`The image you uploaded could not be decoded, or was too large. Go "Back" in your browser and try another image.`) != -1) &&
        str.search(`<!DOCTYPE`) != -1 && str.search(`<html>`) != -1 && str.search(`<html>`) != -1 && str.search(`<meta`) != -1)
        return false;
    return true;
}

function makeRand(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

function checkMorse(str) {
    for (let i = 0; i < str.length; i++) {
        if (str[i] != '.' && str[i] != '-' && str[i] != '/' && str[i] != ' ') {
            return false;
        }
    }
    return true;
}

function addPlayertoLeaderBoard(str, lb) {
    lb.content += str + "\n";
}

//24/7
const http = require('http');
http.createServer((_, res) => res.end("Bủh")).listen(8080)

client.login(process.env['token']).catch(err => {
    console.log("[ERROR]: Invalid Token Provided")
})