export class AppSettings {
    public static NAMES_DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    public static NAMES_MONTH = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    public static CONFIG = {
        '002': {
            code: 'ucs',
            name: 'cientifica',
            institution: 'PREGR',
            img: 'assets/logos/cientifica.png',
            img_pdf: 'assets/cientifica_pdf.png',
            color: '#204491',
            img_url: ''
        },
        '003': {
            code: 'sise',
            name: 'sise',
            institution: 'SISE',
            img: 'assets/logos/sise.png',
            img_pdf: 'assets/sise.png',
            color: '#e12726',
            img_url: ''
        },
        '004': {
            code: 'usise',
            name: 'usise',
            institution: 'USISE',
            img: 'assets/logos/usise.jpg',
            img_pdf: 'assets/sise.png',
            color: '#0079be',
            img_url: ''
        }
    };
    public static STRINGS_COMPANY = {
        '002': {
            'emplid': 'emplid',
            'institution': 'institution',
        },
        '003': {
            'emplid': 'EMPLID',
            'institution': 'INSTITUTION',
        },
        '004': {

        }
    };
    public static ETHNICITIES = [
        { value: "01", name: 'QUECHUA' },
        { value: "02", name: 'AYMARA' },
        { value: "03", name: 'NATIVO O INDÍGENA DE LA AMAZONÍA' },
        { value: "04", name: 'PERTENECIENTE O PARTE DE OTRO PUEBLO INDÍGENA U ORIGINARIO' },
        { value: "05", name: 'NEGRO/MORENO/ZAMBO/MULATO/PUEBLO AFROPERUANO O AFRODESCENDIENTE' },
        { value: "06", name: 'BLANCO' },
        { value: "07", name: 'MESTIZO' },
        { value: "08", name: 'OTROS' },
        // { value: "00", name: 'NO CUENTA CON INFORMACIÓN' },
    ]
    public static ACCESS_VAC = { "action": "login", "name": "admin", "pass": "aic37896" };
    public static URL_LOGIN  = "https://login-ad.educad.pe/";
    public static BASE_NODEJS = 'https://apirest.educad.pe:3000';
    public static SERVICES_EDUCAD = "https://wsasistencia.educad.pe";
    public static BASE_DESEMPENO_DOCENTE = "https://back-desempeno.educad.pe/";
    public static SERVICES_INCORPORACION = "https://back-incorporacion.educad.pe/api";
    public static BASE_SISE_CODEIGNITER = 'https://proyectos.educad.pe';
    //------------------------------- ENV PRODUCTION -------------------------------//
    // public static BASE_UCSUR_LARAVEL = 'http://dev3.pasarela.educad.pe/api'; // FAKE PROD

    public static BASE_UCSUR_LARAVEL = 'https://pasarela.educad.pe/api'; // REAL PROD
    public static BASE_SISE_LARAVEL = 'https://pasarela.sise.edu.pe/api';
    public static BASE_UCSUR_LARAVEL_AUTH = AppSettings.BASE_UCSUR_LARAVEL + '/auth';
    public static PRODUCTION = "https://educanet-back.educad.pe";
    public static DISPO = "https://cuadernosevaluacion-back.cientifica.edu.pe/v1/";
    //------------------------------- ENV DEVELOP -------------------------------//
    // public static BASE_UCSUR_LARAVEL = 'http://dev2.pasarela.educad.pe/api';
    // public static BASE_UCSUR_LARAVEL_AUTH = 'http://dev2.pasarela.educad.pe/api/auth';
    // public static BASE_SISE_LARAVEL  = 'https://dev-pasarela.sise.edu.pe/api';
    // public static PRODUCTION = "https://educanet-back.educad.pe";
    // public static DISPO = "https://dev-disponibilidad-back.educad.pe/v1/";
    //------------------------------- ENV DEVELOP -------------------------------//
    public static BASE_PATH_DENUNCIA = AppSettings.PRODUCTION + '/denuncia/';
    public static ACCESS_PS = AppSettings.PRODUCTION + `/resources_portal/access_ps`;
    public static LOGIN_TOKEN = AppSettings.PRODUCTION + '/ucsur_token/access';
    public static WS_DRUPAL_GENERARTOKEN = AppSettings.PRODUCTION+'/session/token';
    public static WS_DRUPAL_LOGINVACACIONES = AppSettings.PRODUCTION+'/vacaciones/user';
    public static BASE_PATH = AppSettings.PRODUCTION + '/resources_portal/';
    public static BASE_PAYMENT_HISTORY = 'https://fractal.grupoeducad.edu.pe/ServicioRestWebFRACTAL/api/DescargarBoletaRemuneracion';
    public static BASE_FRACTAL = 'https://fractal.grupoeducad.edu.pe/ServicioRestWebFRACTAL/api';
    public static MOODLE = "https://aulavirtual.educad.pe/local/wseducad/auth/sso.php?";
    public static BASE_CONSTANCIA_TRABAJO = "http://educanet-pdf.educad.pe";
}