import React from 'react';
import { ComposableMap, Geographies, Geography, Annotation } from 'react-simple-maps';
import { Tooltip } from 'react-tooltip';

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/europe/europe.json";

const EmployeeRegion = () => {
  const regions = [
    { name: "England", employees: 4, coordinates: [-1.5, 52.3555] },
    { name: "France", employees: 4, coordinates: [2.2137, 46.2276] },
    { name: "Poland", employees: 2, coordinates: [19.1451, 51.9194] },
  ];

  return (
    <div className="employee-region">
      <h3>Employee Region</h3>
      <ComposableMap projection="geoAzimuthalEqualArea" projectionConfig={{ scale: 800 }}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#DDD"
                stroke="#FFF"
                data-tooltip-id=""
              />
            ))
          }
        </Geographies>
        {regions.map(({ name, employees, coordinates }) => (
          <Annotation
            key={name}
            subject={coordinates}
            dx={-30}
            dy={-30}
            connectorProps={{
              stroke: "#FF5533",
              strokeWidth: 2,
              strokeLinecap: "round",
            }}
            data-tooltip-id={name}
            data-tooltip-content={`${name} (${employees} Employees)`}
          >
            <text x="-8" textAnchor="end" alignmentBaseline="middle" fill="#F53">
              {name}
            </text>
            <Tooltip id={name} />
          </Annotation>
        ))}
      </ComposableMap>
    </div>
  );
};

export default EmployeeRegion;
