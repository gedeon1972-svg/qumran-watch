/* * js/data.js
 * EL TESORO SAGRADO: Textos, fechas y liturgia estática.
 * Este archivo alimenta al resto de la aplicación.
 */

const QumranData = {
    // ANCLA ASTRONÓMICA (20 de Marzo de 2019 = Miércoles, Equinoccio + Luna Llena)
    ANCHOR: { y: 2019, m: 2, d: 20, turnoIdx: 21 }, 

    MESES: [
        "Mes 1 (Aviv)", "Mes 2 (Ziv)", "Mes 3 (Siván)", "Mes 4", 
        "Mes 5 (Av)", "Mes 6 (Elul)", "Mes 7 (Etanim)", "Mes 8 (Bul)", 
        "Mes 9", "Mes 10", "Mes 11", "Mes 12"
    ],

    DIAS: [
        "Yom Rishon (Día Uno)", "Yom Sheni (Día Dos)", "Yom Shlishi (Día Tres)", 
        "Yom Revii (Día Cuatro)", "Yom Hamishi (Día Cinco)", "Yom Shishi (Día Seis)", 
        "Shabat (Reposo)"
    ],

    // CICLO DE 24 TURNOS SACERDOTALES (1 CRÓNICAS 24)
    TURNOS: [
        "Yehoiarib", "Jedaiah", "Harim", "Seorim", "Malquías", "Mijamín", 
        "Hacoz", "Abías", "Jesúa", "Secanías", "Eliasib", "Jaquim", 
        "Hupa", "Jesebeab", "Bilga", "Imer", "Hezir", "Hapises", 
        "Petaías", "Ezequiel", "Jaquín", "Gamul", "Delaía", "Maaziah"
    ],

    // PUERTAS POR DONDE SALE EL SOL (ENOC 72)
    // Mes 1->P4, Mes 2->P5, Mes 3->P6, etc.
    PUERTAS_SOLARES: [4, 5, 6, 6, 5, 4, 3, 2, 1, 1, 2, 3],

    // --- 10 DÍAS DE TEMOR (MANDAMIENTOS PARA EL MES 7) ---
    YAMIM_NORAIM: [
        {t:"El Despertar", r:"Rom 13:11"}, 
        {t:"La Confesión", r:"1 Juan 1:9"}, 
        {t:"Reconciliación", r:"Mt 5:24"}, 
        {t:"Restitución", r:"Lc 19:8"}, 
        {t:"Humildad", r:"Stg 4:10"}, 
        {t:"Ayuno de Palabras", r:"Sant 1:26"}, 
        {t:"Caridad", r:"Prov 21:3"}, 
        {t:"Santidad del Cuerpo", r:"1 Cor 6:19"}, 
        {t:"Perdón Absoluto", r:"Mc 11:25"}, 
        {t:"Aflicción de Alma", r:"Lev 16"}
    ],

    // --- ENLACES Y RECURSOS (COMUNIDAD) ---
    ENLACES: [
        {
            id: "telegram",
            titulo: "Canal de Telegram",
            desc: "Recibe las últimas novedades directamente a tu celular.",
            url: "https://t.me/+VuFNIOUSMERrLLiD",
            label: "Unirme al Canal ➔",
            color: "#229ED9" // Color Telegram
        },
        {
            id: "podcast",
            titulo: "Diseñados para Gobernar",
            desc: "Recupera tu gobierno interior a través del análisis profundo.",
            url: "https://youtube.com/playlist?list=PLr4MABEXstnDLUVcD7EenO4vN8EglZoSz",
            label: "Escuchar ahora ➔",
            color: "#8a2c2c" // Red
        },
        {
            id: "instituto",
            titulo: "Instituto Descubre la Biblia",
            desc: "Formación bíblica profunda y cursos online.",
            url: "https://www.descubrelabiblia.online/",
            label: "Visitar Sitio Web ➔",
            color: "#4a90e2" // Blue
        }
    ],

    // --- LAS FIESTAS DE YHWH (MOEDIM) ---
    FIESTAS: [
        {m:0, d:1, n:"Rosh Hashaná", es:"Inicio de Año (Mes 1)", instr:"Tocad trompeta en el inicio del mes (Jodesh), en el día señalado, en el día de nuestra fiesta solemne. Estatuto para Israel es.", ref:"Salmo 81:3-4", nota:"NOTA DE ESTUDIO: La palabra 'Jodesh' implica renovación. En el contexto del calendario de Enoc, esto marca la entrada solar (Tekufah), no la fase de luna nueva rabínica."},
        {m:0, d:10, n:"Selección Cordero", es:"Separación del Cordero", instr:"En el décimo día de este mes tomarán cada uno un cordero según las familias de los padres, un cordero por familia.", ref:"Éxodo 12:3"},
        {m:0, d:14, n:"PESAJ", es:"Cena de Pascua", instr:"Y lo guardaréis hasta el día catorce de este mes, y lo inmolará toda la congregación de Israel entre las dos tardes. Es la Pascua de YHWH.", ref:"Éxodo 12:6"},
        {m:0, d:15, n:"Hag Hamatzot", es:"Panes Sin Levadura", dur:7, instr:"Siete días comeréis panes sin levadura. El primer día será santa convocación; el séptimo día será santa convocación. Ninguna obra se hará en ellos.", ref:"Éxodo 12:15-16"},
        {m:0, d:26, n:"Bikurim", es:"Primicias (Omer)", instr:"Traeréis la gavilla de las primicias de vuestra siega al sacerdote, el cual mecerá la gavilla delante de YHWH.", ref:"Levítico 23:10-11"},
        {m:1, d:14, n:"Pesaj Sheni", es:"Segunda Pascua", instr:"Si alguno de vosotros estuviere inmundo o lejos de viaje, celebrará la pascua a YHWH en el mes segundo.", ref:"Números 9:10-11"},
        {m:2, d:15, n:"SHAVUOT", es:"Fiesta de las Semanas", instr:"Y contaréis siete semanas cumplidas... hasta el día siguiente del séptimo día de reposo. Ofreceréis nuevo grano a YHWH.", ref:"Levítico 23:15-16"}, 
        {m:3, d:1, n:"Inicio Verano", es:"Estación de Verano", instr:"Tú has establecido todos los términos de la tierra; el verano y el invierno tú los formaste.", ref:"Salmo 74:17"},
        {m:4, d:3, n:"Tirosh", es:"Fiesta del Vino Nuevo", instr:"Cuando siegues tu mies... traerás vino nuevo. Alegrate delante de YHWH tu Dios.", ref:"Rollo del Templo 11QT"}, 
        {m:5, d:22, n:"Yitzhar", es:"Fiesta del Aceite", instr:"Ofrenda de las primicias del aceite fresco, para iluminar el santuario.", ref:"Rollo del Templo 11QT"}, 
        {m:6, d:1, n:"YOM TERUAH", es:"Fiesta de las Trompetas", instr:"En el mes séptimo, al primero del mes, tendréis día de reposo, una conmemoración al son de trompetas, y una santa convocación.", ref:"Levítico 23:24"}, 
        {m:6, d:10, n:"YOM KIPUR", es:"Día de Expiación", especial:true, instr:"A los diez días de este mes séptimo será día de expiación. El ayuno total inicia al atardecer del día 9 y concluye al atardecer del día 10. Ninguna obra haréis.", ref:"Levítico 23:32"}, 
        {m:6, d:15, n:"SUCOT", es:"Fiesta de los Tabernáculos", dur:7, instr:"En tabernáculos habitaréis siete días; todo natural de Israel habitará en tabernáculos, para que sepan vuestros descendientes que en tabernáculos hice yo habitar a los hijos de Israel.", ref:"Levítico 23:42"}, 
        {m:6, d:22, n:"Shemini Atzeret", es:"El Octavo Día", instr:"El octavo día tendréis solemnidad; ninguna obra de siervos haréis.", ref:"Números 29:35"}
    ],

    // --- SALMOS DIARIOS (SHIR SHEL YOM - TEMPLO) ---
    SALMOS: [
        {t: "Salmo 24", v: "De YHWH es la tierra y su plenitud;\nEl mundo, y los que en él habitan.\nPorque él la fundó sobre los mares,\nY la afirmó sobre los ríos.\n¿Quién subirá al monte de YHWH?\n¿Y quién estará en su lugar santo?\nEl limpio de manos y puro de corazón;\nEl que no ha elevado su alma a cosas vanas,\nNi jurado con engaño.\nÉl recibirá bendición de YHWH,\nY justicia del Dios de salvación.\nTal es la generación de los que le buscan,\nDe los que buscan tu rostro, oh Dios de Jacob.\nAlzad, oh puertas, vuestras cabezas,\nY alzaos vosotras, puertas eternas,\nY entrará el Rey de gloria.\n¿Quién es este Rey de gloria?\nYHWH el fuerte y valiente,\nYHWH el poderoso en batalla.\nAlzad, oh puertas, vuestras cabezas,\nY alzaos vosotras, puertas eternas,\nY entrará el Rey de gloria.\n¿Quién es este Rey de gloria?\nYHWH de los ejércitos,\nÉl es el Rey de la gloria."},
        {t: "Salmo 48", v: "Grande es YHWH, y digno de ser en gran manera alabado\nEn la ciudad de nuestro Dios, en su monte santo.\nHermosa provincia, el gozo de toda la tierra,\nEs el monte de Sion, a los lados del norte,\nLa ciudad del gran Rey.\nEn sus palacios Dios es conocido por refugio.\nPorque he aquí los reyes de la tierra se reunieron;\nPasaron todos.\nY viéndola ellos así, se maravillaron,\nSe turbaron, se apresuraron a huir.\nLes tomó allí temblor;\nDolor como de mujer que da a luz.\nCon viento solano quiebras tú las naves de Tarsis.\nComo lo oímos, así lo hemos visto\nEn la ciudad de YHWH de los ejércitos, en la ciudad de nuestro Dios;\nLa afirmará Dios para siempre.\nNos acordamos de tu misericordia, oh Dios,\nEn medio de tu templo.\nConforme a tu nombre, oh Dios,\nAsí es tu loor hasta los fines de la tierra;\nDe justicia está llena tu diestra.\nSe alegrará el monte de Sion;\nSe gozarán las hijas de Judá\nPor tus juicios.\nAndad alrededor de Sion, y rodeadla;\nContad sus torres.\nConsiderad bien sus antemuros,\nMirad sus palacios,\nPara que lo contéis a la generación venidera.\nPorque este Dios es Dios nuestro eternamente y para siempre;\nÉl nos guiará aun más allá de la muerte."},
        {t: "Salmo 82", v: "Dios está en la reunión de los dioses;\nEn medio de los dioses juzga.\n¿Hasta cuándo juzgaréis injustamente,\nY aceptaréis las personas de los impíos?\nDefended al débil y al huérfano;\nHaced justicia al afligido y al menesteroso.\nLibrad al afligido y al necesitado;\nLibradlo de mano de los impíos.\nNo saben, no entienden,\nAndan en tinieblas;\nTiemblan todos los cimientos de la tierra.\nYo dije: Vosotros sois dioses,\nY todos vosotros hijos del Altísimo;\nPero como hombres moriréis,\nY como cualquiera de los príncipes caeréis.\nLevántate, oh Dios, juzga la tierra;\nPorque tú heredarás todas las naciones."},
        {t: "Salmo 94", v: "YHWH, Dios de las venganzas,\nDios de las venganzas, muéstrate.\nEngrandécete, oh Juez de la tierra;\nDa el pago a los soberbios.\n¿Hasta cuándo los impíos,\nHasta cuándo, oh YHWH, se gozarán los impíos?\n¿Hasta cuándo pronunciarán, hablarán cosas duras,\nY se vanagloriarán todos los que hacen iniquidad?\nA tu pueblo, oh YHWH, quebrantan,\nY a tu heredad afligen.\nA la viuda y al extranjero matan,\nY a los huérfanos quitan la vida.\nY dijeron: No verá JAH,\nNi entenderá el Dios de Jacob.\nEntended, necios del pueblo;\nY vosotros, fatuos, ¿cuándo seréis sabios?\nEl que hizo el oído, ¿no oirá?\nEl que formó el ojo, ¿no verá?\nEl que castiga a las naciones, ¿no reprenderá?\n¿No sabrá el que enseña al hombre la ciencia?\nYHWH conoce los pensamientos de los hombres,\nQue son vanidad.\nBienaventurado el hombre a quien tú, JAH, corriges,\nY en tu ley lo instruyes,\nPara hacerle descansar en los días de aflicción,\nEn tanto que para el impío se cava el hoyo.\nPorque no abandonará YHWH a su pueblo,\nNi desamparará su heredad,\nSino que el juicio será vuelto a la justicia,\nY en pos de ella irán todos los rectos de corazón.\n¿Quién se levantará por mí contra los malignos?\n¿Quién estará por mí contra los que hacen iniquidad?\nSi no me ayudara YHWH,\nPronto moraría mi alma en el silencio.\nCuando yo decía: Mi pie resbala,\nTu misericordia, oh YHWH, me sustentaba.\nEn la multitud de mis pensamientos dentro de mí,\nTus consolaciones alegraban mi alma.\n¿Se juntará contigo el trono de iniquidades\nQue hace agravio bajo forma de ley?\nSe juntan contra la vida del justo,\nY condenan la sangre inocente.\nMas YHWH me ha sido por refugio,\nY mi Dios por roca de mi confianza.\nY él hará volver sobre ellos su iniquidad,\nY los destruirá en su propia maldad;\nLos destruirá YHWH nuestro Dios."},
        {t: "Salmo 81", v: "Cantad con gozo a Dios, fortaleza nuestra;\nAl Dios de Jacob aclamad con júbilo.\nEntonad canción, y tañed el pandero,\nEl arpa deliciosa y el salterio.\nTocad la trompeta en el inicio del mes (Jodesh),\nEn el día señalado, en el día de nuestra fiesta solemne.\nPorque estatuto es de Israel,\nOrdenanza del Dios de Jacob.\nLo constituyó como testimonio en José\nCuando salió por la tierra de Egipto.\nOí lenguaje que no entendía;\nAparté su hombro de la carga;\nSus manos se descargaron de los cestos.\nEn la calamidad clamaste, y yo te libré;\nTe respondí en lo secreto del trueno;\nTe probé junto a las aguas de Meriba.\nOye, pueblo mío, y te amonestaré.\nIsrael, si me oyeres,\nNo habrá en ti dios ajeno,\nNi te inclinarás a dios extraño.\nYo soy YHWH tu Dios,\nQue te hice subir de la tierra de Egipto;\nAbre tu boca, y yo la llenaré.\nPero mi pueblo no oyó mi voz,\nE Israel no me quiso a mí.\nLos dejé, por tanto, a la dureza de su corazón;\nCaminaron en sus propios consejos.\n¡Oh, si me hubiera oído mi pueblo,\nSi en mis caminos hubiera andado Israel!\nEn un momento habría yo derribado a sus enemigos,\nY vuelto mi mano contra sus adversarios.\nLos que aborrecen a YHWH se le habrían sometido,\nY el tiempo de ellos sería para siempre.\nLes sustentaría Dios con lo mejor del trigo,\nY con miel de la peña les saciaría."},
        {t: "Salmo 93", v: "YHWH reina; se vistió de magnificencia;\nYHWH se vistió, se ciñó de poder.\nAfirmó también el mundo, y no se moverá.\nFirme es tu trono desde entonces;\nTú eres eternamente.\nAlzaron los ríos, oh YHWH,\nLos ríos alzaron su sonido;\nAlzaron los ríos sus ondas.\nYHWH en las alturas es más poderoso\nQue el estruendo de las muchas aguas,\nMás que las recias ondas del mar.\nTus testimonios son muy firmes;\nLa santidad conviene a tu casa,\nOh YHWH, por los siglos y para siempre."},
        {t: "Salmo 92", v: "Bueno es alabarte, oh YHWH,\nY cantar salmos a tu nombre, oh Altísimo;\nAnunciar por la mañana tu misericordia,\nY tu fidelidad cada noche,\nEn el decacordio y en el salterio,\nEn tono suave con el arpa.\nPor cuanto me has alegrado, oh YHWH, con tus obras;\nEn las obras de tus manos me gozo.\n¡Cuán grandes son tus obras, oh YHWH!\nMuy profundos son tus pensamientos.\nEl hombre necio no sabe,\nY el insensato no entiende esto.\nCuando brotan los impíos como la hierba,\nY florecen todos los que hacen iniquidad,\nEs para ser destruidos eternamente.\nMas tú, YHWH, para siempre eres Altísimo.\nPorque he aquí tus enemigos, oh YHWH,\nPorque he aquí, perecerán tus enemigos;\nSerán esparcidos todos los que hacen maldad.\nPero tú aumentarás mis fuerzas como las del búfalo;\nSeré ungido con aceite fresco.\nY mirarán mis ojos sobre mis enemigos;\nOirán mis oídos de los que se levantaron contra mí, de los malignos.\nEl justo florecerá como la palmera;\nCrecerá como cedro en el Líbano.\nPlantados en la casa de YHWH,\nEn los atrios de nuestro Dios florecerán.\nAun en la vejez fructificarán;\nEstarán vigorosos y verdes,\nPara anunciar que YHWH mi fortaleza es recto,\nY que en él no hay injusticia."}
    ],

    // --- CÁNTICOS DEL SACRIFICIO DEL SHABAT (QUMRÁN) ---
    CANTICOS_SHABAT: [
        {t: "Cántico del 1er Shabat", v: "Alabad al Dios de los altísimos, oh vosotros santos entre los santos. Y dad gloria al Rey de la gloria, porque él ha elegido a los de eterna santidad de entre todos los hijos de luz.\nPorque a los santos de Él ha constituido para ser los ministros del Santo de los santos. Y ellos son los ángeles del conocimiento y los espíritus de la justicia del cielo. \n¡Cantad al Dios de poder con la ofrenda de la lengua más pura! ¡Exaltad su gloria con labios de bendición! Porque Él ha establecido los fundamentos del firmamento eterno y ha separado la luz de las tinieblas para su santidad."},
        {t: "Cántico del 2do Shabat", v: "Cantad alabanzas a YHWH, todos sus ejércitos celestiales. Bendecid al Rey de la gloria, todos los espíritus de conocimiento.\nNo hay impureza en su presencia, ni espíritu de engaño en su morada santa. Él purifica a sus siervos con fuego de verdad, y los lava con aguas de pureza eterna.\nAlabadle, fundamentos de la tierra; exaltadle, abismos del mar. Porque Él ha medido las aguas con el hueco de su mano y ha pesado los montes en balanza. ¡Santo, Santo, Santo es YHWH de los ejércitos!"},
        {t: "Cántico del 3er Shabat", v: "Bendecid al Dios de la vida, oh espíritus inmortales. Exaltad al Creador de los mundos, vosotros que estáis ante su trono.\nPorque Él es el Dios de todo espíritu y el Señor de toda carne. Él juzga a los poderosos con justicia y a los humildes con misericordia.\nSu trono está rodeado de fuego y relámpagos, y sus ángeles corren como centellas para cumplir su palabra. ¡Alabad su nombre eternamente, porque su reino no tiene fin!"},
        {t: "Cántico del 4to Shabat", v: "Alabad al Dios de la majestad, oh príncipes de la altura. Dad gloria al que habita en la eternidad, cuyo nombre es Santo.\nÉl ha extendido los cielos como una cortina y ha establecido las estrellas en sus cursos. El sol y la luna le obedecen, y no se desvían de su mandato.\nTodo lo que respira alabe a YHWH. Desde los cielos de los cielos hasta las profundidades de la tierra, sea su nombre exaltado."},
        {t: "Cántico del 5to Shabat", v: "Cantad al Dios de la salvación, oh redimidos de YHWH. Proclamad sus maravillas entre las naciones, y su gloria a todos los pueblos.\nPorque grande es YHWH y digno de suprema alabanza; temible sobre todos los dioses. Porque todos los dioses de los pueblos son ídolos, pero YHWH hizo los cielos.\nAlabanza y magnificencia delante de él; poder y gloria en su santuario."},
        {t: "Cántico del 6to Shabat", v: "Bendecid al Juez de toda la tierra, vosotros que guardáis su pacto. Exaltad al Vengador de la sangre inocente, que no olvida el clamor de los afligidos.\nÉl quebrantará el brazo del impío y perseguirá su maldad hasta que no halle ninguna. Pero los justos heredarán la tierra y vivirán en ella para siempre.\n¡Justicia y juicio son el cimiento de su trono; misericordia y verdad van delante de su rostro!"},
        {t: "Cántico del 7mo Shabat", v: "¡Aleluya! Alabad a YHWH desde los cielos; alabadle en las alturas. Alabadle, vosotros todos sus ángeles; alabadle, vosotros todos sus ejércitos.\nAlabadle, sol y luna; alabadle, vosotras todas, lucientes estrellas. Alabadle, cielos de los cielos, y las aguas que están sobre los cielos.\nAlaben el nombre de YHWH; porque él mandó, y fueron creados. Los hizo ser eternamente y para siempre; les puso ley que no será quebrantada."},
        {t: "Cántico del 8vo Shabat", v: "Cantad a YHWH un cántico nuevo; su alabanza sea en la congregación de los santos. Alégrese Israel en su Hacedor; los hijos de Sion se gocen en su Rey.\nAlaben su nombre con danza; con pandero y arpa a él canten. Porque YHWH tiene contentamiento en su pueblo; hermoseará a los humildes con la salvación.\nExalten a Dios con sus gargantas, y espadas de dos filos en sus manos."},
        {t: "Cántico del 9no Shabat", v: "Te exaltaré, mi Dios, mi Rey, y bendeciré tu nombre eternamente y para siempre. Cada día te bendeciré, y alabaré tu nombre eternamente y para siempre.\nGrande es YHWH, y digno de suprema alabanza; y su grandeza es inescrutable. Generación a generación celebrará tus obras, y anunciará tus poderosos hechos.\nLa hermosura de la gloria de tu magnificencia, y tus hechos maravillosos, hablaré."},
        {t: "Cántico del 10mo Shabat", v: "Alaba, oh alma mía, a YHWH. Alabaré a YHWH en mi vida; cantaré salmos a mi Dios mientras viva.\nNo confiéis en los príncipes, ni en hijo de hombre, porque no hay en él salvación. Pues sale su aliento, y vuelve a la tierra; en ese mismo día perecen sus pensamientos.\nBienaventurado aquel cuyo ayudador es el Dios de Jacob, cuya esperanza está en YHWH su Dios, el cual hizo los cielos y la tierra, el mar, y todo lo que en ellos hay."},
        {t: "Cántico del 11vo Shabat", v: "Alabad a YHWH, porque es bueno; porque para siempre es su misericordia. Diga ahora Israel, que para siempre es su misericordia.\nDiga ahora la casa de Aarón, que para siempre es su misericordia. Digan ahora los que temen a YHWH, que para siempre es su misericordia.\nDesde la angustia invoqué a JAH, y me respondió JAH, poniéndome en lugar espacioso. YHWH está conmigo; no temeré lo que me pueda hacer el hombre."},
        {t: "Cántico del 12vo Shabat", v: "Lámpara es a mis pies tu palabra, y lumbrera a mi camino. Juré y ratifiqué que guardaré tus justos juicios.\nAfligido estoy en gran manera; vivifícame, oh YHWH, conforme a tu palabra. Te ruego, oh YHWH, que te sean agradables los sacrificios voluntarios de mi boca, y me enseñes tus juicios.\nMi vida está de continuo en peligro, mas no me he olvidado de tu ley. Me pusieron lazo los impíos, pero no me desvié de tus mandamientos."},
        {t: "Cántico del 13er Shabat", v: "Te alabaré con todo mi corazón; delante de los dioses te cantaré salmos. Me postraré hacia tu santo templo, y alabaré tu nombre por tu misericordia y tu fidelidad.\nPorque has engrandecido tu nombre, y tu palabra sobre todas las cosas. El día que clamé, me respondiste; me fortaleciste con vigor en mi alma.\nTe alabarán, oh YHWH, todos los reyes de la tierra, porque han oído los dichos de tu boca. Y cantarán de los caminos de YHWH, porque la gloria de YHWH es grande."}
    ],

    // --- 52 HALAJOT DEL MESÍAS (UNA PARA CADA SEMANA) ---
    // h: Hebreo, c: Contexto, f: Filología, t: Título, q: Cita, a: Acción, r: Referencia
    HALAKHA: [
        {
            t:"La Verdad", 
            h: "Emet (אֱמֶת)",
            c: "Sermón del Monte",
            f: "Emet implica firmeza, estabilidad y fiabilidad. Que tu 'sí' sea tan sólido como un contrato escrito ante el Cielo.",
            q:"Sea vuestro hablar: Sí, sí; no, no.", 
            a:"Evita hoy toda exageración o juramento. Que tu palabra baste.", 
            r:"Mt 5:37"
        },
        {
            t:"Amor Radical", 
            h: "Ahavá (אַהֲבָה)",
            c: "Justicia del Reino",
            f: "Ahavá no es solo un sentimiento, es una acción de voluntad y lealtad. Es elegir buscar el bien del otro, incluso del enemigo.",
            q:"Amad a vuestros enemigos, bendecid a los que os maldicen.", 
            a:"Ora hoy por alguien que te ofendió sin hablar mal de él.", 
            r:"Mt 5:44"
        },
        {
            t:"Mirada Pura", 
            h: "Ayin Tovah (עַיִן טוֹבָה)",
            c: "La Lámpara del Cuerpo",
            f: "Tener 'Buen Ojo' en hebreo significa ser generoso y no envidioso. La forma en que miras al mundo define la luz de tu alma.",
            q:"Si tu ojo es bueno, todo tu cuerpo estará lleno de luz.", 
            a:"Cuida lo que miras hoy. Evita la codicia visual.", 
            r:"Mt 6:22"
        },
        {
            t:"Tesoro Real", 
            h: "Otzar (אוֹצָר)",
            c: "Sobre la Ansiedad",
            f: "Donde pones tu seguridad (tu tesoro), allí está tu lealtad. El tesoro celestial es lo que das, no lo que guardas.",
            q:"Donde esté vuestro tesoro, allí estará también vuestro corazón.", 
            a:"Da una ofrenda secreta a un necesitado hoy.", 
            r:"Mt 6:21"
        },
        {
            t:"Sin Afán", 
            h: "Bitachon (בִּטָּחוֹן)",
            c: "Providencia Divina",
            f: "Confianza activa. No es pasividad, sino la certeza de que el Padre sustenta. El afán divide la mente; la fe la unifica.",
            q:"No os afanéis por el día de mañana.", 
            a:"Cuando sientas ansiedad, da gracias por 3 cosas que ya tienes.", 
            r:"Mt 6:34"
        },
        {t:"Regla de Oro", h:"Chesed (חֶסֶד)", c:"Torá y Profetas", f:"Amor leal. Haz por otros lo que quisieras para ti.", q:"Todas las cosas que queráis que los hombres hagan con vosotros, así también haced.", a:"Haz un favor proactivo antes de que te lo pidan.", r:"Mt 7:12"},
        {t:"Cimiento", h:"Emunah (אֱמוּנָה)", c:"Los dos constructores", f:"Fidelidad. No es solo creer, es construir vida sobre la obediencia.", q:"El que oye estas palabras y las hace, le compararé a un hombre prudente.", a:"Obedece una instrucción difícil hoy sin quejarte.", r:"Mt 7:24"},
        {t:"Misericordia", h:"Rachamim (רַחֲמִים)", c:"Llamado de Mateo", f:"Amor entrañable, como el de una madre (Rechem).", q:"Misericordia quiero, y no sacrificio.", a:"Muestra compasión con alguien que cometa un error hoy.", r:"Mt 9:13"},
        {t:"Humildad", h:"Anavah (עֲנָוָה)", c:"Contra los Fariseos", f:"Conocer tu lugar ante Dios. No es debilidad, es control del ego.", q:"El que se humilla será enaltecido.", a:"Cede el mejor lugar o el paso a otra persona hoy.", r:"Mt 23:12"},
        {t:"Perdón", h:"Selichah (סְלִיחָה)", c:"Parábola del siervo", f:"Soltar la deuda. El perdón libera al acreedor más que al deudor.", q:"No te digo hasta siete, sino aun hasta setenta veces siete.", a:"Perdona una deuda emocional pendiente hoy.", r:"Mt 18:22"},
        {t:"Vigilancia", h:"Shokéd (שֹׁקֵד)", c:"Discurso del Monte", f:"Estar alerta, como el almendro que despierta primero.", q:"Velad, pues, porque no sabéis a qué hora ha de venir vuestro Señor.", a:"Vive esta hora como si Yeshua llegara hoy.", r:"Mt 24:42"},
        {t:"Servicio", h:"Avodá (עֲבוֹדָה)", c:"Petición de Santiago y Juan", f:"Servicio y Adoración son la misma palabra. Servir es adorar.", q:"El Hijo del Hombre no vino para ser servido, sino para servir.", a:"Sirve en la tarea más humilde de tu casa hoy.", r:"Mt 20:28"},
        {t:"Luz", h:"Or (אוֹר)", c:"Sal y Luz", f:"La luz no hace ruido, solo alumbra. Tus obras hablan más que tu voz.", q:"Así alumbre vuestra luz delante de los hombres.", a:"Haz una buena obra pública que glorifique al Padre.", r:"Mt 5:16"},
        {t:"Ira", h:"Ka'as (כַּעַס)", c:"Homicidio del corazón", f:"La ira es idolatría del yo. Quien se enoja, pierde la sabiduría.", q:"Cualquiera que se enoje contra su hermano, será culpable de juicio.", a:"Controla tu temperamento hoy; no respondas mal.", r:"Mt 5:22"},
        {t:"Reconciliación", h:"Shalom (שָׁלוֹם)", c:"Ofrenda en el altar", f:"Restaurar la plenitud. El altar espera hasta que la paz vuelva.", q:"Deja allí tu ofrenda... y anda, reconcíliate primero.", a:"Llama a alguien con quien estés enemistado.", r:"Mt 5:24"},
        {t:"Segunda Milla", h:"Nedivut (נְדִיבוּת)", c:"Resistencia no violenta", f:"Generosidad del espíritu. Hacer más de lo requerido rompe la opresión.", q:"A cualquiera que te obligue a llevar carga por una milla, ve con él dos.", a:"Haz más de lo que se te exige en tu trabajo hoy.", r:"Mt 5:41"},
        {t:"Secreto", h:"Seter (סֵתֶר)", c:"Limosna y Oración", f:"El lugar oculto donde habita el Altísimo. La intimidad requiere privacidad.", q:"Tu Padre que ve en lo secreto te recompensará en público.", a:"Ora a solas 10 minutos sin decirle a nadie.", r:"Mt 6:6"},
        {t:"El Pan", h:"Lechem (לֶחֶם)", c:"Padre Nuestro", f:"Sustento diario. Reconocer que todo viene de Su mano, día a día.", q:"El pan nuestro de cada día, dánoslo hoy.", a:"Agradece por cada comida y comparte tu pan.", r:"Mt 6:11"},
        {t:"Juicio", h:"Mishpat (מִשְׁפָּט)", c:"La viga y la paja", f:"Justicia. Al juzgar al otro, estableces la medida para ti mismo.", q:"No juzguéis, para que no seáis juzgados.", a:"Si ves un error en otro, calla y ora por él.", r:"Mt 7:1"},
        {t:"La Puerta", h:"Delet (דֶּלֶת)", c:"Dos caminos", f:"La entrada al Reino requiere despojarse de cargas innecesarias.", q:"Entrad por la puerta estrecha.", a:"Elige el camino difícil pero correcto hoy.", r:"Mt 7:13"},
        {t:"Frutos", h:"Peri (פְּרִי)", c:"Falsos profetas", f:"El resultado visible de la esencia invisible. El carácter es la prueba.", q:"Por sus frutos los conoceréis.", a:"Que tus acciones de hoy muestren paciencia y bondad.", r:"Mt 7:20"},
        {t:"Confesión", h:"Todah (תּוֹדָה)", c:"Envío de los doce", f:"Confesión y agradecimiento. Reconocer públicamente la verdad.", q:"A cualquiera que me confiese delante de los hombres, yo también le confesaré.", a:"Habla de Yeshua a alguien hoy.", r:"Mt 10:32"},
        {t:"Descanso", h:"Menuchah (מְנוּחָה)", c:"Yugo fácil", f:"Reposo del alma. No es inactividad, es paz en medio de la labor.", q:"Venid a mí todos los que estáis trabajados... y yo os haré descansar.", a:"Dedica 15 min a reposar en Su presencia.", r:"Mt 11:28"},
        {t:"Palabras", h:"Lashon (לָשׁוֹן)", c:"El árbol y el fruto", f:"La lengua revela el corazón. La vida y la muerte están en su poder.", q:"De toda palabra ociosa que hablen los hombres, de ella darán cuenta.", a:"Evita el chisme y la queja hoy.", r:"Mt 12:36"},
        {t:"Sembrador", h:"Zera (זֶרַע)", c:"Parábolas del Reino", f:"La semilla es la Palabra. El corazón es la tierra que decide el fruto.", q:"El que fue sembrado en buena tierra, éste es el que oye y entiende.", a:"Medita en la Escritura profundamente hoy.", r:"Mt 13:23"},
        {t:"Limpieza", h:"Taharah (טָהֳרָה)", c:"Tradiciones humanas", f:"Pureza ritual vs moral. Lo interno define lo externo.", q:"Lo que sale de la boca, esto contamina al hombre.", a:"Purifica tu vocabulario hoy.", r:"Mt 15:11"},
        {t:"Fe", h:"Emunah (אֱמוּנָה)", c:"El joven lunático", f:"Confianza total en el poder de Dios, aunque sea pequeña como semilla.", q:"Si tuvierais fe como un grano de mostaza...", a:"Ora por un imposible creyendo.", r:"Mt 17:20"},
        {t:"Niños", h:"Yeladim (יְלָדִים)", c:"Grandeza en el Reino", f:"Inocencia, dependencia y falta de ambición de poder.", q:"Si no os volvéis y os hacéis como niños, no entraréis en el reino.", a:"Mantén la inocencia y la capacidad de asombro hoy.", r:"Mt 18:3"},
        {t:"Acuerdo", h:"Echad (אֶחָד)", c:"Disciplina eclesial", f:"Unidad. Cuando dos corazones laten como uno, Dios está allí.", q:"Si dos de vosotros se pusieren de acuerdo... les será hecho.", a:"Ora con tu pareja o amigo por una meta común.", r:"Mt 18:19"},
        {t:"Honra", h:"Kavod (כָּבוֹד)", c:"Joven rico", f:"Dar peso, importancia y respeto a quienes nos dieron la vida.", q:"Honra a tu padre y a tu madre.", a:"Llama o visita a tus padres para bendecirlos.", r:"Mt 19:19"},
        {t:"Grandeza", h:"Gedulah (גְּדֻלָּה)", c:"Petición de Zebedeos", f:"En el Reino, subir es bajar. El esclavo de todos es el rey de todos.", q:"El que quiera hacerse grande entre vosotros será vuestro servidor.", a:"Busca cómo servir, no cómo ser servido.", r:"Mt 20:26"},
        {t:"Fe Activa", h:"Bitachon (בִּטָּחוֹן)", c:"La higuera estéril", f:"Certeza de que la oración ya ha sido respondida en el cielo.", q:"Todo lo que pidiereis en oración, creyendo, lo recibiréis.", a:"Pide con certeza, sin dudar.", r:"Mt 21:22"},
        {t:"Amor Total", h:"Shema (שְׁמַע)", c:"El Gran Mandamiento", f:"Escucha y obedece. Amar con todo el ser, sin reservas.", q:"Amarás al Señor tu Dios con todo tu corazón.", a:"Dile a Dios que lo amas con voz audible.", r:"Mt 22:37"},
        {t:"Prójimo", h:"Rea (רֵעַ)", c:"Segundo Mandamiento", f:"El otro no es ajeno, es tu espejo. Tu compañero de pacto.", q:"Amarás a tu prójimo como a ti mismo.", a:"Trata al extraño con la dignidad de un rey.", r:"Mt 22:39"},
        {t:"Justicia", h:"Tzedaká (צְדָקָה)", c:"Ay de los Escribas", f:"Justicia social y rectitud. Más importante que el diezmo de la menta.", q:"¡Ay de vosotros... que dejáis lo más importante: la justicia, la misericordia y la fe!", a:"Sé justo en tus tratos comerciales hoy.", r:"Mt 23:23"},
        {t:"Retorno", h:"Shuv (שׁוּב)", c:"Señales del fin", f:"El regreso. La esperanza de la redención final es visible.", q:"Como el relámpago que sale del oriente... así será la venida del Hijo.", a:"Mira al cielo y recuerda Su promesa.", r:"Mt 24:27"},
        {t:"Talentos", h:"Kishronot (כִּשְׁרוֹנוֹת)", c:"Parábola de los talentos", f:"Responsabilidad. Usar lo dado para el Reino.", q:"Bien, buen siervo y fiel; sobre poco has sido fiel.", a:"Haz tu trabajo con excelencia, aunque nadie te vea.", r:"Mt 25:21"},
        {t:"El Menor", h:"Katan (קָטָן)", c:"Juicio de las naciones", f:"El rostro de Dios se esconde en el rostro del necesitado.", q:"En cuanto lo hicisteis a uno de estos mis hermanos más pequeños, a mí lo hicisteis.", a:"Ayuda al más vulnerable que encuentres.", r:"Mt 25:40"},
        {t:"La Copa", h:"Kos (כּוֹס)", c:"Última Cena", f:"Pacto de sangre. Participar de su vida y de su entrega.", q:"Bebed de ella todos; porque esto es mi sangre.", a:"Recuerda el sacrificio de Yeshua antes de comer.", r:"Mt 26:27"},
        {t:"Discipulado", h:"Talmidim (תַּלְמִידִים)", c:"Gran Comisión", f:"Hacer aprendices que imiten al Maestro, no solo creyentes.", q:"Id, y haced discípulos a todas las naciones.", a:"Enseña un principio bíblico a alguien hoy.", r:"Mt 28:19"},
        {t:"Autoridad", h:"Samchut (סַמְכוּת)", c:"Gran Comisión", f:"Poder delegado. Actuar en Nombre del Rey.", q:"Toda potestad me es dada en el cielo y en la tierra.", a:"Camina con la seguridad de un hijo del Rey.", r:"Mt 28:18"},
        {t:"Sábado", h:"Shabat (שַׁבָּת)", c:"Espigas en Shabat", f:"Cesar. El día es para el hombre, para su restauración y libertad.", q:"El día de reposo fue hecho por causa del hombre.", a:"Prepárate para deleitarte en el Shabat.", r:"Mr 2:27"},
        {t:"Dar", h:"Natan (נָתַן)", c:"El sermón del llano", f:"Dar es un ciclo. Lo que das, regresa multiplicado.", q:"Dad, y se os dará; medida buena... rebosando.", a:"Sé generoso hoy con tu tiempo o dinero.", r:"Lc 6:38"},
        {t:"Negación", h:"Mesirut Nefesh (מְסִירdוּת נֶפֶשׁ)", c:"Seguimiento", f:"Entrega del alma. Poner la voluntad de Dios sobre la propia.", q:"Si alguno quiere venir en pos de mí, niéguese a sí mismo.", a:"Di 'no' a un deseo egoísta hoy.", r:"Lc 9:23"},
        {t:"Arado", h:"Charishah (חֲרִישָׁה)", c:"Discipulado radical", f:"Enfoque. No se puede hacer surcos rectos mirando atrás.", q:"Ninguno que poniendo su mano en el arado mira hacia atrás, es apto.", a:"No añores el pasado; enfócate en lo que viene.", r:"Lc 9:62"},
        {t:"Prójimo II", h:"Rea (רֵעַ)", c:"Buen Samaritano", f:"La misericordia define al prójimo, no la raza.", q:"¿Quién de estos tres te parece que fue el prójimo?", a:"Sé un buen samaritano con quien no se lo espera.", r:"Lc 10:36"},
        {t:"Luz Interior", h:"Or (אוֹר)", c:"Lámpara del cuerpo", f:"La conciencia debe estar iluminada por la verdad, no oscurecida.", q:"Mira pues, no suceda que la luz que en ti hay, sea tinieblas.", a:"Examina tus intenciones más profundas.", r:"Lc 11:35"},
        {t:"Vida", h:"Chayim (חַיִּים)", c:"El rico insensato", f:"La vida verdadera no está en las cosas, sino en la conexión con Dios.", q:"La vida del hombre no consiste en la abundancia de los bienes que posee.", a:"Valora una relación más que una posesión hoy.", r:"Lc 12:15"},
        {t:"Banquete", h:"Seudáh (סְעוּדָה)", c:"Los invitados", f:"El Reino es un banquete de gracia para los indignos.", q:"Cuando hagas banquete, llama a los pobres.", a:"Comparte tu comida con alguien humilde.", r:"Lc 14:13"},
        {t:"Fidelidad", h:"Ne'eman (נֶאֱמָן)", c:"Mayordomo infiel", f:"Integridad en lo pequeño. Dios prueba en lo invisible.", q:"El que es fiel en lo muy poco, también en lo más es fiel.", a:"Cuida los detalles pequeños hoy.", r:"Lc 16:10"},
        {t:"Gratitud", h:"Todah (תּוֹדָה)", c:"Los diez leprosos", f:"Reconocer el bien recibido completa el milagro.", q:"¿No eran diez los que fueron limpiados? Y los nueve, ¿dónde están?", a:"Agradece a quien te ha servido hoy.", r:"Lc 17:17"},
        {t:"Oración", h:"Tefilah (תְּפִלָּה)", c:"Juez injusto", f:"Conexión constante. No desmayar es tener 'Chutzpah' (audacia) santa.", q:"Orar siempre, y no desmayar.", a:"Mantén una conversación continua con Dios.", r:"Lc 18:1"}
    ]
};