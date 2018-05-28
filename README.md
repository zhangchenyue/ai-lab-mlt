# AI LAB Machine Learning Toolkit

## Preconditions
1. Ensure install nodejs 8.x from http://nodejs.org

2. Ensure install latest NPM
```
> npm install -g npm@latest
``` 

3. Ensure You are in Adim Group if you want to see DB logs (server/appSettigns.json)
 


## Steps for build
1. Clone this repository to your computer
```
> git clone https://slb1-swt.visualstudio.com/Support-Software_Metier_GIT/_git/AI_LAB_MLT
> cd AI_LAB_MLT
``` 
2. Install dependacies using NPM
```
> npm install
``` 

3. Build application using npm build task
```
> npm run build
``` 

4. Start application
```
> npm start
``` 

5. Open bowser and visit http://localhost:5000 to see the index page


## Steps for debug

1. As Build Step 1, 2


2. Debug (live reload)
```
> npm run debug
```


## Steps for test

1. As Build Step 1, 2


2. Test (both ut and e2e)
```
> npm test
```


## Steps for Package

1. As Build Step 1, 2


2. Package (generate pkg folder)
```
> npm run pkg
```

3. Copy the pkg folder to any target server to deploy