/**
 * Generated On: 2016-02-25
 * Class: CoordStars
 * Description: get coord of stars like earth...
 */
import Coordinates from './Coordinates';

const CoordStars = {

    getSunPosition() {
        const m = Math;
        const PI = m.PI;
        const sin = m.sin;
        const cos = m.cos;
        const tan = m.tan;
        const asin = m.asin;
        const atan = m.atan2;

        const rad = PI / 180;
        const dayMs = 1000 * 60 * 60 * 24;
        const J1970 = 2440588;
        const J2000 = 2451545;
        const e = rad * 23.4397; // obliquity of the Earth

        function toJulian(date) {
            return date.valueOf() / dayMs - 0.5 + J1970;
        }

        function toDays(date) {
            return toJulian(date) - J2000;
        }

        function getRightAscension(l, b) {
            return atan(sin(l) * cos(e) - tan(b) * sin(e), cos(l));
        }

        function getDeclination(l, b) {
            return asin(sin(b) * cos(e) + cos(b) * sin(e) * sin(l));
        }

        function getAzimuth(H, phi, dec) {
            return atan(sin(H), cos(H) * sin(phi) - tan(dec) * cos(phi));
        }

        function getAltitude(H, phi, dec) {
            return asin(sin(phi) * sin(dec) + cos(phi) * cos(dec) * cos(H));
        }

        function getSiderealTime(d, lw) {
            return rad * (280.16 + 360.9856235 * d) - lw;
        }

        function getSolarMeanAnomaly(d) {
            return rad * (357.5291 + 0.98560028 * d);
        }

        function getEquationOfCenter(M) {
            return rad * (1.9148 * sin(M) + 0.0200 * sin(2 * M) + 0.0003 * sin(3 * M));
        }

        function getEclipticLongitude(M, C) {
            var P = rad * 102.9372; // perihelion of the Earth
            return M + C + P + PI;
        }

        return function getSunPosition(date, lat, lon) {
            const lw = rad * -lon;
            const phi = rad * lat;
            const d = toDays(date);
            const M = getSolarMeanAnomaly(d);
            const C = getEquationOfCenter(M);
            const L = getEclipticLongitude(M, C);
            const D = getDeclination(L, 0);
            const A = getRightAscension(L, 0);
            const t = getSiderealTime(d, lw);
            const H = t - A;

            return {
                EclipticLongitude: L,
                declinaison: D,
                ascension: A,
                H,
                SiderealTime: t,
                altitude: getAltitude(H, phi, D),
                azimuth: getAzimuth(H, phi, D) + PI / 2, // + PI// - PI/2 // origin: north !!! not like original Mourner code but more classical ref
            };
        };
    },
/*
    // Return scene coordinate ({x,y,z}) of sun
    getSunPositionInScene(date, lat, lon) {
        var sun = CoordStars.getSunPosition()(date, lat, lon);
        var dayMilliSec = 24 * 3600000;
        var longitude = sun.ascension + ((date % dayMilliSec) / dayMilliSec) * -360 + 180; // cause midday
        var coSunCarto = new Coordinates('EPSG:4326', longitude, lat, 50000000)
                                        .as('EPSG:4978').xyz();

        return coSunCarto;
    },
*/

    getSunPositionInSceneAtTime(d){
        var date = d || new Date();
        var rad = 0.017453292519943295;
        // based on NOAA solar calculations
        var mins_past_midnight = (date.getUTCHours() * 60 + date.getUTCMinutes()) / 1440;
        var jc = (((date.getTime() / 86400000.0) + 2440587.5) - 2451545)/36525;
        var mean_long_sun = (280.46646+jc*(36000.76983+jc*0.0003032)) % 360;
        var mean_anom_sun = 357.52911+jc*(35999.05029-0.0001537*jc);
        var sun_eq = Math.sin(rad*mean_anom_sun)*(1.914602-jc*(0.004817+0.000014*jc))+Math.sin(rad*2*mean_anom_sun)*(0.019993-0.000101*jc)+Math.sin(rad*3*mean_anom_sun)*0.000289;
        var sun_true_long = mean_long_sun + sun_eq;
        var sun_app_long = sun_true_long - 0.00569 - 0.00478*Math.sin(rad*125.04-1934.136*jc);
        var mean_obliq_ecliptic = 23+(26+((21.448-jc*(46.815+jc*(0.00059-jc*0.001813))))/60)/60;
        var obliq_corr = mean_obliq_ecliptic + 0.00256*Math.cos(rad*125.04-1934.136*jc);
        var lat = Math.asin(Math.sin(rad*obliq_corr)*Math.sin(rad*sun_app_long)) / rad;
        var eccent = 0.016708634-jc*(0.000042037+0.0000001267*jc);
        var y = Math.tan(rad*(obliq_corr/2))*Math.tan(rad*(obliq_corr/2));
        var rq_of_time = 4*((y*Math.sin(2*rad*mean_long_sun)-2*eccent*Math.sin(rad*mean_anom_sun)+4*eccent*y*Math.sin(rad*mean_anom_sun)*Math.cos(2*rad*mean_long_sun)-0.5*y*y*Math.sin(4*rad*mean_long_sun)-1.25*eccent*eccent*Math.sin(2*rad*mean_anom_sun))/rad);
        var true_solar_time = (mins_past_midnight*1440+rq_of_time) % 1440;
        var lng = -((true_solar_time/4 < 0) ? true_solar_time/4 + 180 : true_solar_time/4 - 180);

        var coSunCarto = new Coordinates('EPSG:4326', lng, lat, lat)
                                            .as('EPSG:4978').xyz();

        return coSunCarto;
    //   return {sunlat:lat, sunlon:lng};
    }

};

export default CoordStars;
