const http = require('http');
const express = require('express');
const ejs = require('ejs');
const pm2 = require('pm2');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    pm2.list((err, processDescriptionList) => {
        res.status(200).render("html", {
            processDescriptionList: processDescriptionList.map(p => ({
                id: p.pm_id,
                pid: p.pid,
                monit: p.monit,
                name: p.name,
                status: p.pm2_env.status,
                uptime: new Date(p.pm2_env.pm_uptime).toLocaleString(),
                restarts: p.pm2_env.unstable_restarts
            }))
        });
    });
});

const httpServer = http.createServer(app);
httpServer.listen(8080, () => {
    console.log('HTTP Server running on port 8080');
});