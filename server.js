import express from 'express';
import cookieparser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
// import https from 'https';
import axios from 'axios';
 
import dotenv from 'dotenv';
dotenv.config();

const server = express();
server.use(cookieparser());
server.use(cors());
// server.get('/',(req,res)=> {
//     res.sendFile(path.resolve('input'));  
// });
// server.get('/repos',(req,res)=> {
//   res.sendFile(path.resolve('repos'));  
// });
server.use("/images", express.static(path.resolve('images')));
server.use("/", express.static(path.resolve('input')));

const apiQuery = username => '{' +
              'user(login: "'+username+'") {' +
                'avatarUrl(size: 120),' +
              'bio,' +
              'name,' +
                'login,' +
                'repositories(first: 20) {' +
                  'totalCount,' +
                  'nodes {' +
                    'name,' +
                    'url,' +
                    'updatedAt,' +
                    'forkCount,' +
                    'stargazerCount,' +
                    'description,' +
                    'languages(first: 1) {' +
                      'edges {' +
                        'node {' +
                          'name' +
                        '}' +
                      '}' +
                    '}' +
                  '}' +
                '}' +
              '}' +
            '}';


async function fetchGit(username) {
  return await axios.post("https://api.github.com/graphql", {
        query: apiQuery(username)
      },
    {
     
      headers: {
            'Authorization': 'Bearer ' + process.env.GIT_TOKEN
            
        }
    }
  )
}
server.get('/user/:username',async (req,res)=> {
    const {username}= req.params;
    const {data} = (await fetchGit(username)).data;
    console.log(username);
    res.status(200).send(data.user)
})

server.listen(800,()=> {
    console.info('server listening')
})

