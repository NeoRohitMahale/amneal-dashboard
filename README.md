#Installation process

1. Make sure Node.js and Angulat CLI is installed, if not type following command:

   ---npm install -g @angular/cli (for angular)

2. Open terminal and navigate to project directory

3. Install node_modules by typing
  
   ---npm i
   
4. To run application in development mode type:
  
   ---ng serve

    Note:
    By  default server would start on port 4200
    To start server on a specific port type:
    
    --ng serve --port <port_number>
    e.g. ng serve port 8500
    
5. To run application in production mode type:

   ----ng serve --prod --aot --host 0.0.0.0 --port 8500
   
    Note:
    By default server would start on port 4200
    To start server on a specific port type:
       
    ----ng serve --prod --aot --host 0.0.0.0 --port <port_number>
     e.g. ng serve --prod --aot --host 0.0.0.0 --port 8500
    
