const $fh = require('fh-mbaas-api');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const request = require('request-promise')

const db = require('./db-store');

const EMPLOYEES_SERVICE_GUID = process.env.EMPLOYEES_SERVICE_GUID;
const EMPLOYEES_COLLECTION_NAME = process.env.EMPLOYEES_COLLECTION_NAME || "employees";
const EMPLOYEES_MOCK_UP_SERVICE_URL = process.env.EMPLOYEES_MOCK_UP_SERVICE_URL || "http://demo2703148.mockable.io/employees";
const MOCKED_UP = process.env.MOCKED_UP || "true";

const EMPLOYEES_SERVICE_ATTRS = ['tipoRespuesta', 'modoConsulta', 'codigosEmpresa', 'codigosCentroCoste',
  'idsDivision', 'idsSubdivision', 'idsDireccionArea', 'funciones', 'idsDireccionTerritorial',
  'idsDelegacion', 'fecha', 'nombresUsuario', 'login'];

function _searchEmployeesMockedUp (filter) {
  return new Promise(function(resolve, reject) {
    db.list(EMPLOYEES_COLLECTION_NAME, filter, function (err, data) {
      if (err) {
        reject({result:'ERROR', msg: err});
      } else {
        resolve(data);
      }
    });
  });
}

function _searchEmployees(filter) {
  if (typeof filter !== 'undefined' && typeof filter.eq !== 'undefined') {
    var qs = EMPLOYEES_SERVICE_ATTRS.reduce(function(acc, val) {
      console.log('acc', acc, 'val', val, 'filter.eq[val]', filter.eq[val]);
      acc[val] = (filter.eq[val] || '');
      console.log('new acc', acc);
      return acc;
    }, {});

    console.log('qs', JSON.stringify(qs));

    var options = {
      method: 'GET',
      uri: EMPLOYEES_MOCK_UP_SERVICE_URL,
      qs: qs,
      //body: filter,
      json: true
    };
    return request(options);
  }
  return new Promise(function (resolve, reject) {
    reject({result:'ERROR', msg: 'filter has to be eq', filter: JSON.stringify(filter)});
  })
}

function searchEmployees(filter) {
  console.log('MOCKED_UP', MOCKED_UP);
  if (MOCKED_UP === 'true') {
    console.log('_searchEmployeesMockedUp');
    return _searchEmployeesMockedUp(filter);
  } else {
    console.log('_searchEmployees');
    return _searchEmployees(filter);
  }
}

function adaptEmployees (data) {
  return new Promise(function(resolve, reject) {
    if (data && data.constructor === Array)  {
      var _data = data.map(function (element) {
        if (element) {
          return {
            type: 'employee',
            firstName: element.Nombre,
            lastName: element.Apellido1 + ' ' + element.Apellido2,
            email: element.Email,
            department: element.UniOrganizativa
          };
        }
      });
      resolve(_data);
    } else {
      reject({result:'ERROR', msg: 'Data returned not an Array', data: JSON.stringify(data)});
    }
  });
}

function route() {
  var router = new express.Router();
  router.use(cors());
  router.use(bodyParser.json());
  router.use(bodyParser.urlencoded({ extended: true }));

  router.post('/', function(req, res) {
    var filter = req.body;
    console.log('filter: ' + JSON.stringify(filter));
    if (typeof filter === 'undefined') {
      res.status(404).json([]);
      return;
    }

    searchEmployees(filter)
    .then(function (data) {
      return adaptEmployees(data);
    })
    .then(function (data) {
      res.status(200).json(data);
    })
    .catch(function (err) {
      res.status(500).json({result:'ERROR', msg: err})
    });
  });

  return router;
}

module.exports = route;
