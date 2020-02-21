const http = require('http');
const express = require('express');
const pm2 = require('pm2');
const fs = require('fs');
const { promisify } = require('util');
const os = require('os');

const app = express();

app.use(express.json());
app.set('view engine', 'ejs');

const readFileAsync = promisify(fs.readFile);

app.get("/", (req, res) => {
    pm2.list(async (err, processDescriptionList) => {
        res.status(200).render("html", {
            processDescriptionList: await Promise.all(processDescriptionList.map(async p => ({
                id: p.pm_id,
                pid: p.pid,
                monit: p.monit,
                name: p.name,
                status: p.pm2_env.status,
                uptime: new Date(p.pm2_env.pm_uptime).toLocaleString(),
                restarts: p.pm2_env.unstable_restarts,
                outlogs: (await readFileAsync(p.pm2_env.pm_out_log_path, "utf8")).toString().split('\n').slice(-10),
                errorlogs: (await readFileAsync(p.pm2_env.pm_err_log_path, "utf8")).toString().split('\t').slice(-10)
            }))),
            osInformation: {
                menUsage: os.totalmem() - os.freemem(),
                totalMen: os.totalmem(),
                freeMen: os.freemem(),
                cpuUsage: os.cpus(),
                uptime: os.uptime(),
            }
        });
    });
});

const httpServer = http.createServer(app);
httpServer.listen(8080, () => {
    console.log('HTTP Server running on port 8080');
});