# Employees Data Service

This Employees Data MBaaS Service contains...

# Group Employees Data Service API

## Get Employees information [/employees?employeeId={employeeId}]
These endpoints have to do with the event data uploaded by RH Marketing Operations

+ Parameters
    + employeeId: 1 (number) - A unique identifier of the employee.

### Retrieve an employee [GET]
Endpoint to obtain the employee object associated with the provided ID
+ Response 200 (application/json)
    + Body
            {
                "type" : "employee",
                "employeeId" : "0101",
                "firstName": "JUAN CARLOS",
                "lastName": "GARCIA",
                "department": "MARKETING"
            }

## Retrieve employees data [/employees]
These endpoints have to do with querying

### Query employees [POST]
This endpoint return employees matching the provided criteria object.

+ Request (application/json)
    + Body
            {
               "eq" : {
                 "tipoRespuesta" : "1",
                 "modoConsulta" : "0",
                 "codigosEmpresa" : "8100",
                 "codigosCentroCoste" : "",
                 "idsDivision" : "",
                 "idsSubdivision" : "BD08",
                 "idsDireccionArea" : "",
                 "funciones" : "",
                 "idsDireccionTerritorial" : "1000",
                 "idsDelegacion" : "",
                 "fecha" : "20170101",
                 "nombresUsuario" : "",
                 "login" : "rsanchez"
               }
            }

+ Response 200 (application/json)
    + Body
            {
              "result" : "SUCCESS",
              "count" : 2,
              "list" : [
                {
                    "type" : "employee",
                    "employeeId" : "0101",
                    "firstName": "JUAN CARLOS",
                    "lastName": "GARCIA",
                    "department": "MARKETING"
                },
                {
                  "type" : "employee",
                  "employeeId" : "0201",
                  "firstName": "JOSE CARLOS",
                  "lastName": "GARCIA",
                  "department": "SUPPORT"
                }
              ]
            }
