export interface Planet {
  full_name: string;
  ma: number;
  epoch: number;
  a: number;
  e: number;
  i: number;
  w_bar?: number; // longitude of perihelion
  w: number; // arg of perihelion
  L?: number; // mean longitude
  n?: number;
  om: number; // longitude of ascending node
  P?: number;
}

// http://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html
// http://ssd.jpl.nasa.gov/txt/aprx_pos_planets.pdf
export const MERCURY: Planet = {
  full_name: 'Mercury',
  ma: 174.79252722,
  epoch: 2451545.0,
  a: 0.38709927,
  e: 0.20563593,
  i: 7.00497902,
  w_bar: 77.45779628,
  w: 29.12703035,
  L: 252.25032350,
  om: 48.33076593,
  P: 87.969
};

export const VENUS: Planet = {
  full_name: 'Venus',
  ma: 50.37663232,
  epoch: 2451545.0,
  a: 0.72333566,
  e: 0.00677672,
  i: 3.39467605,
  w_bar: 131.60246718,
  w: 54.92262463,
  L: 181.97909950,
  om: 76.67984255,
  P: 224.701
};

export const EARTH: Planet = {
  full_name: 'Earth',
  epoch: 2451545.0,
  ma: -2.47311027,
  a: 1.00000261,
  e: 0.01671123,
  i: 0,
  w_bar: 102.93768193,
  w: 114.20783,
  L: 100.46457166,
  om: 348.73936,
  P: 365.256
};

export const MARS: Planet = {
  full_name: 'Mars',
  ma: 19.39019754,
  epoch: 2451545.0,
  a: 1.52371034,
  e: 0.09339410,
  i: 1.84969142,
  w_bar: -23.94362959,
  w: -73.5031685,
  L: -4.55343205,
  om: 49.55953891,
  P: 686.980
};

export const JUPITER: Planet = {
  full_name: 'Jupiter',
  ma: 19.66796068,
  epoch: 2451545.0,
  a: 5.20288700,
  e: 0.04838624,
  i: 1.30439695,
  w_bar: 14.72847983,
  w: -85.74542926,
  L: 34.39644051,
  om: 100.47390909,
  P: 4332.589
};
