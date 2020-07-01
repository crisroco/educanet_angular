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
    public static ACCESS_VAC = { "action": "login", "name": "admin", "pass": "aic37896" };
    public static URL_LOGIN  = "http://login-ad.educad.pe/";
    public static BASE_NODEJS = 'http://apirest.educad.pe:3000';
    public static SERVICES_EDUCAD = "http://wsasistencia.educad.pe";
    public static BASE_SISE_CODEIGNITER = 'http://proyectos.educad.pe';
    //------------------------------- ENV PRODUCTION -------------------------------//
    public static BASE_UCSUR_LARAVEL = 'http://dev.pasarela.educad.pe/api';
    public static BASE_SISE_LARAVEL = 'https://pasarela.sise.edu.pe/api';
    public static PRODUCTION = "http://educanet.back.educad.pe";
    //------------------------------- ENV DEVELOP -------------------------------//
    // public static BASE_UCSUR_LARAVEL = 'http://dev2.pasarela.educad.pe/api';
    // public static BASE_SISE_LARAVEL  = 'http://dev.pasarela.sise.edu.pe/api';
    // public static PRODUCTION = "http://dev-educanet.back.educad.pe";
    //------------------------------- ENV DEVELOP -------------------------------//
    public static ACCESS_PS = AppSettings.PRODUCTION + `/resources_portal/access_ps`;
    public static LOGIN_TOKEN = AppSettings.PRODUCTION + '/ucsur_token/access';
    public static WS_DRUPAL_GENERARTOKEN = AppSettings.PRODUCTION+'/session/token';
	public static WS_DRUPAL_LOGINVACACIONES = AppSettings.PRODUCTION+'/vacaciones/user';
	public static BASE_PATH = AppSettings.PRODUCTION + '/resources_portal/';
    public static BASE_PAYMENT_HISTORY = 'http://35.196.72.217/ServicioRestWebFRACTAL/api/DescargarBoletaRemuneracion';
    public static MOODLE = "http://aulavirtual.educad.pe/local/wseducad/auth/sso.php?";
}