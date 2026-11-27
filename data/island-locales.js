/* Draft fan translations of the original English game terms. No numeric values are translated. */
const islandExtraLanguages=['es','vi','ar','zh','hr','it'];
const islandExtraWords={};
const islandWordKeys='title sub port land sea sets all search empty back from to not power lux cost copies effects additional steps requires unlocks limit place size setBonus setTip notActive active max noUpgrade noCost noEffects unlockAt fragments artMissing portTip base current target total electro level decor owned deficit'.split(' ');
const islandWordRows={
es:`Isla|Desarrollo · colecciones · bonificaciones de combate|Puerto|Decoraciones|Edificios marítimos|Conjuntos|Todos|Buscar por nombre|Sin resultados|Atrás|Nivel actual|Nivel objetivo|Bloqueado|Poder|Lujo|Recursos necesarios|Copias de la decoración|Atributos|Bonificaciones adicionales|Por niveles|Requisitos de mejora|Desbloquea|Límite de bonificaciones activas|Límite de colocación|Tamaño|Bonificación del conjunto|La bonificación depende del nivel más bajo de las cinco decoraciones.|Conjunto inactivo|Nivel del conjunto|Máx.|No hay mejoras disponibles|No se necesitan recursos adicionales|Sin bonificaciones de combate|Se desbloquea en el nivel|Fragmentos para canjear|Imagen no disponible|Mejora los cuatro edificios del puerto. Las bonificaciones adicionales se acumulan.|Bonificaciones básicas|Actual|Tras la mejora|Total|La electrocución se desbloquea en el nivel 10 del muelle de la isla. Dura 4 segundos.|Nivel|Decoración|Disponible|Faltan`,
vi:`Đảo|Phát triển · bộ sưu tập · chỉ số chiến đấu|Cảng|Trang trí|Công trình biển|Bộ trang trí|Tất cả|Tìm theo tên|Không tìm thấy|Quay lại|Cấp hiện tại|Cấp mục tiêu|Chưa mở khóa|Sức mạnh|Độ xa hoa|Tài nguyên cần thiết|Bản sao trang trí|Thuộc tính|Thưởng bổ sung|Theo từng cấp|Yêu cầu nâng cấp|Mở khóa|Giới hạn hiệu lực|Giới hạn đặt|Kích thước|Thưởng bộ|Thưởng phụ thuộc vào cấp thấp nhất trong năm vật trang trí.|Bộ chưa kích hoạt|Cấp bộ|Tối đa|Không thể nâng cấp|Không cần thêm tài nguyên|Không có thưởng chiến đấu|Mở khóa ở cấp|Mảnh đổi vật phẩm|Không có hình ảnh|Nâng cấp bốn công trình cảng. Thưởng bổ sung được cộng dồn.|Thưởng cơ bản|Hiện tại|Sau nâng cấp|Tổng|Điện giật mở khóa khi bến đảo đạt cấp 10. Kéo dài 4 giây.|Cấp|Trang trí|Đang có|Còn thiếu`,
ar:`الجزيرة|التطوير · المجموعات · مكافآت القتال|الميناء|الزينة|المنشآت البحرية|المجموعات|الكل|البحث بالاسم|لا توجد نتائج|رجوع|المستوى الحالي|المستوى المستهدف|غير مفتوح|القوة|الفخامة|الموارد المطلوبة|نسخ الزينة|السمات|مكافآت إضافية|حسب المستوى|متطلبات الترقية|يفتح|حد المكافآت الفعالة|حد الوضع|الحجم|مكافأة المجموعة|تُحدد المكافأة حسب أدنى مستوى بين قطع الزينة الخمس.|المجموعة غير مفعلة|مستوى المجموعة|الأقصى|لا توجد ترقيات|لا حاجة إلى موارد إضافية|لا توجد مكافآت قتالية|يفتح عند المستوى|شظايا للاستبدال|الصورة غير متاحة|طوّر منشآت الميناء الأربع. تتراكم المكافآت الإضافية.|المكافآت الأساسية|الحالي|بعد الترقية|الإجمالي|تُفتح الصعقة الكهربائية عند المستوى 10 من رصيف الجزيرة. تدوم 4 ثوانٍ.|المستوى|زينة|المتوفر|المتبقي`,
zh:`島嶼|發展 · 收藏 · 戰鬥加成|港口|裝飾|海上建築|套裝|全部|按名稱搜尋|沒有結果|返回|目前等級|目標等級|未解鎖|戰力|豪華度|所需資源|裝飾副本|屬性|額外加成|逐級明細|升級要求|解鎖|加成生效上限|擺放上限|尺寸|套裝加成|套裝加成由五件裝飾中的最低等級決定。|套裝未啟用|套裝等級|最高|無法升級|不需要額外資源|無戰鬥加成|解鎖等級|兌換碎片|暫無圖片|升級四座港口建築。額外加成可累積。|基礎加成|目前|升級後|合計|島嶼碼頭達到10級時解鎖電擊，持續4秒。|等級|裝飾|已有|缺少`,
hr:`Otok|Razvoj · kolekcije · borbeni bonusi|Luka|Ukrasi|Morske građevine|Kompleti|Sve|Pretraži po nazivu|Nema rezultata|Natrag|Trenutna razina|Ciljna razina|Zaključano|Snaga|Raskoš|Potrebni resursi|Kopije ukrasa|Atributi|Dodatni bonusi|Po razinama|Uvjeti nadogradnje|Otključava|Ograničenje aktivnih bonusa|Ograničenje postavljanja|Veličina|Bonus kompleta|Bonus ovisi o najnižoj razini svih pet ukrasa.|Komplet nije aktivan|Razina kompleta|Maks.|Nema nadogradnji|Nisu potrebni dodatni resursi|Nema borbenih bonusa|Otključava se na razini|Ulomci za razmjenu|Slika nije dostupna|Nadogradite četiri lučke građevine. Dodatni bonusi se zbrajaju.|Osnovni bonusi|Trenutno|Nakon nadogradnje|Ukupno|Strujni udar otključava se na razini 10 otočnog pristaništa. Traje 4 sekunde.|Razina|Ukras|Dostupno|Nedostaje`,
it:`Isola|Sviluppo · collezioni · bonus di combattimento|Porto|Decorazioni|Edifici marini|Set|Tutti|Cerca per nome|Nessun risultato|Indietro|Livello attuale|Livello obiettivo|Bloccato|Potenza|Lusso|Risorse necessarie|Copie della decorazione|Attributi|Bonus aggiuntivi|Per livello|Requisiti di potenziamento|Sblocca|Limite bonus attivi|Limite di posizionamento|Dimensioni|Bonus del set|Il bonus dipende dal livello più basso delle cinque decorazioni.|Set inattivo|Livello del set|Max|Nessun potenziamento disponibile|Non servono risorse aggiuntive|Nessun bonus di combattimento|Si sblocca al livello|Frammenti da scambiare|Immagine non disponibile|Potenzia i quattro edifici del porto. I bonus aggiuntivi si accumulano.|Bonus base|Attuale|Dopo il potenziamento|Totale|L'elettrocuzione si sblocca al livello 10 del molo dell'isola. Dura 4 secondi.|Livello|Decorazione|Disponibile|Mancano`};
for(const [lang,row] of Object.entries(islandWordRows)){const a=row.split('|');if(a.length!==islandWordKeys.length)throw Error('Island locale label count '+lang+' '+a.length);islandExtraWords[lang]=Object.fromEntries(islandWordKeys.map((k,i)=>[k,a[i]]))}
const islandExtraNames=Object.fromEntries(islandExtraLanguages.map(l=>[l,{}]));
const islandNameRows=`
402653186|Cocotero|Cây dừa|نخلة جوز الهند|椰子樹|Kokosova palma|Palma da cocco
402653187|Palmera|Cây cọ|نخلة|棕櫚樹|Palma|Palma
402653188|Farola|Đèn đường|مصباح شارع|路燈|Ulična svjetiljka|Lampione
402653189|Sombrilla|Ô che nắng|مظلة|遮陽傘|Suncobran|Ombrellone
402653190|Hamaca|Võng|أرجوحة شبكية|吊床|Viseća mreža|Amaca
402653191|Fuente|Đài phun nước|نافورة|噴泉|Fontana|Fontana
402653192|Estatua de surfista|Tượng người lướt sóng|تمثال راكب الأمواج|衝浪者雕像|Kip surfera|Statua del surfista
402653193|Estatua de delfín|Tượng cá heo|تمثال دولفين|海豚雕像|Kip dupina|Statua del delfino
402653194|Carrito de comida|Xe bán đồ ăn|عربة طعام|餐車|Kolica s hranom|Carretto del cibo
402653195|Flotador|Phao bơi|عوامة|游泳圈|Kolut za plivanje|Salvagente
402653196|Helicóptero|Trực thăng|مروحية|直升機|Helikopter|Elicottero
402653197|Mansión frente al mar|Biệt thự ven biển|قصر على الشاطئ|海濱豪宅|Vila uz plažu|Villa sul mare
402653198|Sala de conciertos|Nhà biểu diễn nhạc sống|قاعة موسيقى حية|音樂展演館|Koncertna dvorana|Sala concerti
402653199|Parque acuático|Công viên nước|حديقة مائية|水上樂園|Vodeni park|Parco acquatico
402653200|Camino|Đường|طريق|道路|Cesta|Strada
402653201|Jardín shiba inu|Bồn hoa Shiba Inu|حوض زهور شيبا إينو|柴犬花圃|Cvjetnjak Shiba Inu|Aiuola Shiba Inu
402653202|Cine|Rạp chiếu phim|سينما|電影院|Kino|Cinema
402653204|Jardín esférico|Bồn hoa hình cầu|حوض زهور كروي|球形花圃|Kuglasti cvjetnjak|Aiuola sferica
402653205|Muelle de la isla|Bến đảo|رصيف الجزيرة|島嶼碼頭|Otočno pristanište|Molo dell'isola
402653206|Fuente danzante|Đài phun nước nhảy múa|النافورة الراقصة|舞動噴泉|Plesna fontana|Fontana danzante
402653207|Faro|Hải đăng|منارة|燈塔|Svjetionik|Faro
402653208|Barco turístico|Tàu du lịch|قارب سياحي|觀光船|Izletnički brod|Battello turistico
402653209|Hamburguesería|Quán burger|مطعم برغر|漢堡店|Burger bar|Hamburgeria
402653210|Acuario|Thủy cung|حوض أسماك|水族館|Akvarij|Acquario
402653211|Museo de aviación|Bảo tàng hàng không|متحف الطيران|航空博物館|Muzej zrakoplovstva|Museo dell'aviazione
402653212|Cancha de baloncesto|Sân bóng rổ|ملعب كرة سلة|籃球場|Košarkaško igralište|Campo da basket
402653213|Tienda de campaña|Lều|خيمة|帳篷|Šator|Tenda
402653214|Banco romántico|Ghế lãng mạn|مقعد رومانسي|浪漫長椅|Romantična klupa|Panchina romantica
402653215|Barbacoa de playa|Tiệc nướng bãi biển|شواء على الشاطئ|海灘燒烤|Roštilj na plaži|Barbecue in spiaggia
402653216|Jardín de gato|Bồn hoa mèo|حوض زهور القط|貓咪花圃|Mačji cvjetnjak|Aiuola del gatto
402653217|Música de playa|Nhạc bãi biển|موسيقى الشاطئ|海灘音樂|Glazba na plaži|Musica in spiaggia
402653218|Puesto de flores|Quầy hoa|كشك زهور|花攤|Štand s cvijećem|Chiosco di fiori
402653219|Puesto de frutas|Quầy trái cây|كشك فواكه|水果攤|Štand s voćem|Chiosco di frutta
402653220|Estatua de futbolista|Tượng cầu thủ bóng đá|تمثال لاعب كرة قدم|足球員雕像|Kip nogometaša|Statua del calciatore
402653221|Molino de viento|Cối xay gió|طاحونة هواء|風車|Vjetrenjača|Mulino a vento
402653222|Bar de zumos|Quầy nước ép|بار عصائر|果汁吧|Bar sa sokovima|Bar dei succhi
402653223|Muñeco de nieve|Người tuyết|رجل ثلج|雪人|Snjegović|Pupazzo di neve
402653224|Papá Noel|Ông già Noel|بابا نويل|聖誕老人|Djed Božićnjak|Babbo Natale
402653225|Trineo de renos|Xe trượt tuần lộc|زلاجة الرنة|馴鹿雪橇|Saonice sa sobovima|Slitta delle renne
402653226|Árbol de Navidad|Cây thông Noel|شجرة عيد الميلاد|聖誕樹|Božićno drvce|Albero di Natale
402653227|Patio navideño|Sân Giáng sinh|فناء عيد الميلاد|聖誕庭院|Božićno dvorište|Cortile natalizio
402653228|Tablón de anuncios|Bảng thông báo|لوحة إعلانات|公告欄|Oglasna ploča|Bacheca
402653229|Globo romántico|Khinh khí cầu lãng mạn|بالون رومانسي|浪漫氣球|Romantični balon|Pallone romantico
402653230|Árbol del amor|Cây tình yêu|شجرة الحب|愛情樹|Drvo ljubavi|Albero dell'amore
402653231|Cupido|Thần tình yêu|كيوبيد|邱比特|Kupido|Cupido
402653232|Oso del amor|Gấu tình yêu|دب الحب|愛心熊|Medvjed ljubavi|Orso dell'amore
402653233|Jardín de rosas|Vườn hồng|حديقة الورود|玫瑰花園|Ružičnjak|Giardino di rose
402653234|Restaurante de marisco|Nhà hàng hải sản|مطعم مأكولات بحرية|海鮮餐廳|Restoran morskih plodova|Ristorante di pesce
402653235|Minibar acuático|Quầy bar nhỏ ven nước|بار مائي صغير|迷你水吧|Mali bar uz vodu|Minibar sull'acqua
402653236|Planeador|Tàu lượn|طائرة شراعية|滑翔機|Jedrilica|Aliante
402653237|Carrusel|Đu quay ngựa gỗ|دوّامة خيل|旋轉木馬|Vrtuljak|Giostra
402653238|Noria|Vòng đu quay|عجلة دوارة|摩天輪|Panoramski kotač|Ruota panoramica
402653239|Montaña rusa|Tàu lượn siêu tốc|أفعوانية|雲霄飛車|Brdska željeznica|Montagne russe
402653240|Parque de atracciones|Công viên giải trí|مدينة ملاهٍ|遊樂園|Zabavni park|Parco divertimenti
402653241|Cabina telefónica|Buồng điện thoại|كشك هاتف|電話亭|Telefonska govornica|Cabina telefonica
402653242|Restaurante italiano|Nhà hàng Ý|مطعم إيطالي|義大利餐廳|Talijanski restoran|Ristorante italiano
402653243|Panadería|Tiệm bánh|مخبز|麵包店|Pekarnica|Panetteria
402653244|Árbol de caramelos|Cây kẹo|شجرة الحلوى|糖果樹|Stablo slatkiša|Albero delle caramelle
402653245|Carrito de calabazas|Xe bí ngô|عربة اليقطين|南瓜車|Kolica s bundevama|Carretto di zucche
402653246|Banda de calabazas|Ban nhạc bí ngô|فرقة اليقطين|南瓜樂隊|Bend bundeva|Banda delle zucche
402653247|Batería|Bộ trống|طقم طبول|架子鼓|Bubnjevi|Batteria
402653248|Escenario de Halloween|Sân khấu Halloween|مسرح الهالوين|萬聖節舞台|Pozornica za Noć vještica|Palco di Halloween
402653249|Máquina expendedora|Máy bán hàng tự động|آلة بيع|自動販賣機|Prodajni automat|Distributore automatico
402653250|Trampolín|Bạt nhún|ترامبولين|彈跳床|Trampolin|Trampolino
402653251|Coche de carreras|Xe đua|سيارة سباق|賽車|Trkaći automobil|Auto da corsa
402653252|Cafetería|Quán cà phê|مقهى|咖啡館|Kafić|Caffetteria
402653253|Ring de boxeo|Sàn đấu quyền anh|حلبة ملاكمة|拳擊擂台|Boksački ring|Ring di pugilato
402653254|Puesto de surf|Quầy lướt sóng|كشك ركوب الأمواج|衝浪小屋|Surf štand|Chiosco da surf
402653255|Tobogán acuático|Cầu trượt nước|زحليقة مائية|滑水道|Vodeni tobogan|Scivolo acquatico
402653256|Colchoneta flotante|Đệm nổi hồ bơi|مرتبة عائمة|泳池浮床|Madrac za bazen|Materassino da piscina
402653257|Cervecería|Quán bia|حانة بيرة|啤酒屋|Pivnica|Birreria
402653258|Paraíso sin preocupaciones|Thiên đường vô ưu|جنة بلا هموم|無憂樂園|Bezbrižni raj|Paradiso spensierato
402653261|Lámpara giratoria|Đèn xoay|مصباح دوار|旋轉燈|Rotirajuća svjetiljka|Lampada rotante
402653262|Robot|Robot|روبوت|機器人|Robot|Robot
402653263|Valla publicitaria|Bảng quảng cáo|لوحة إعلانية|廣告看板|Reklamni pano|Cartellone pubblicitario
402653264|Tienda de música|Cửa hàng âm nhạc|متجر موسيقى|音樂商店|Glazbena trgovina|Negozio di musica
402653265|Plaza cibernética|Quảng trường công nghệ|الساحة السيبرانية|賽博廣場|Kibernetički trg|Piazza cyber
402653266|Parque de skate|Công viên trượt ván|حديقة التزلج|滑板公園|Skate park|Skatepark
402653268|Quiosco de pesca|Quầy câu cá|كشك صيد|釣魚小屋|Ribički kiosk|Chiosco da pesca
402653269|Tienda de comestibles|Cửa hàng tạp hóa|بقالة|雜貨店|Trgovina namirnicama|Negozio di alimentari
402653270|Salón recreativo|Khu trò chơi điện tử|صالة ألعاب|遊戲廳|Igraonica|Sala giochi
402653272|Supremo: estrella del rock|Tối thượng: ngôi sao nhạc rock|الأسمى: نجم الروك|終極－搖滾巨星|Vrhovni: rock zvijezda|Supremo: rock star
402653273|Supremo: emperador del desastre|Tối thượng: hoàng đế thảm họa|الأسمى: إمبراطور الكارثة|終極－災厄帝王|Vrhovni: car katastrofe|Supremo: imperatore del disastro
402653276|Fortaleza centinela|Pháo đài canh gác|حصن الحارس|哨兵堡壘|Stražarska utvrda|Fortezza sentinella
402653277|Faro científico|Hải đăng khoa học|منارة العلم|科學燈塔|Znanstveni svjetionik|Faro scientifico
402653278|Estrella polar|Sao Bắc Cực|نجم الشمال|北極星|Sjevernjača|Stella polare
402653279|Lancha PEM|Ca nô EMP|زورق النبضة الكهرومغناطيسية|電磁脈衝快艇|EMP gliser|Motoscafo EMP
402653280|Suprema: reina del invierno|Tối thượng: nữ hoàng mùa đông|الأسمى: ملكة الشتاء|終極－冰雪女王|Vrhovna: zimska kraljica|Suprema: regina dell'inverno
402653282|Gran noria|Vòng đu quay lớn|العجلة الدوارة الكبرى|巨型摩天輪|Veliki panoramski kotač|Grande ruota panoramica
402653283|Submarino amarillo|Tàu ngầm vàng|الغواصة الصفراء|黃色潛水艇|Žuta podmornica|Sottomarino giallo
50397205|Velocidad de reclutamiento|Tốc độ tuyển quân|سرعة التجنيد|招募速度|Brzina novačenja|Velocità di reclutamento
50397212|Capacidad de carga|Tải trọng|سعة الحمولة|負重|Nosivost|Capacità di carico
50397214|PV de tropas cuerpo a cuerpo|HP quân cận chiến|صحة قوات الاشتباك|近戰部隊生命值|HP bliskih postrojbi|PV truppe da mischia
50397244|Velocidad de recolección|Tốc độ thu thập|سرعة الجمع|採集速度|Brzina prikupljanja|Velocità di raccolta
50397245|Daño a tropas de largo alcance|Sát thương lên quân tầm xa|ضرر للقوات بعيدة المدى|對遠程部隊傷害|Šteta dalekometnim postrojbama|Danni alle truppe a lungo raggio
50397246|Daño a tropas de alcance medio|Sát thương lên quân tầm trung|ضرر للقوات متوسطة المدى|對中程部隊傷害|Šteta srednjometnim postrojbama|Danni alle truppe a medio raggio
50397247|Daño a tropas cuerpo a cuerpo|Sát thương lên quân cận chiến|ضرر لقوات الاشتباك|對近戰部隊傷害|Šteta bliskim postrojbama|Danni alle truppe da mischia
50397254|Ataque|Tấn công|الهجوم|攻擊|Napad|Attacco
50397255|PV|HP|الصحة|生命值|HP|PV
50397279|Defensa|Phòng thủ|الدفاع|防禦|Obrana|Difesa
50397422|Ataque contra cuerpo a cuerpo|Tấn công quân cận chiến|هجوم ضد قوات الاشتباك|對近戰部隊攻擊|Napad na bliske postrojbe|Attacco contro mischia
50397423|Ataque contra alcance medio|Tấn công quân tầm trung|هجوم ضد قوات متوسطة المدى|對中程部隊攻擊|Napad na srednjometne postrojbe|Attacco contro medio raggio
50397424|Ataque contra largo alcance|Tấn công quân tầm xa|هجوم ضد قوات بعيدة المدى|對遠程部隊攻擊|Napad na dalekometne postrojbe|Attacco contro lungo raggio
50397427|Reducción de ataque enemigo de alcance medio|Giảm tấn công địch tầm trung|خفض هجوم العدو متوسط المدى|敵方中程部隊攻擊降低|Smanjenje napada neprijatelja srednjeg dometa|Riduzione attacco nemico a medio raggio
50397428|Reducción de ataque enemigo de largo alcance|Giảm tấn công địch tầm xa|خفض هجوم العدو بعيد المدى|敵方遠程部隊攻擊降低|Smanjenje napada neprijatelja dugog dometa|Riduzione attacco nemico a lungo raggio
50397430|Reducción de ataque enemigo|Giảm tấn công địch|خفض هجوم العدو|敵方攻擊降低|Smanjenje neprijateljskog napada|Riduzione attacco nemico
50397436|Reducción de defensa enemiga cuerpo a cuerpo|Giảm phòng thủ địch cận chiến|خفض دفاع قوات اشتباك العدو|敵方近戰部隊防禦降低|Smanjenje obrane bliskih neprijatelja|Riduzione difesa nemica da mischia
50397437|Reducción de defensa enemiga de alcance medio|Giảm phòng thủ địch tầm trung|خفض دفاع العدو متوسط المدى|敵方中程部隊防禦降低|Smanjenje obrane neprijatelja srednjeg dometa|Riduzione difesa nemica a medio raggio
50397438|Reducción de defensa enemiga de largo alcance|Giảm phòng thủ địch tầm xa|خفض دفاع العدو بعيد المدى|敵方遠程部隊防禦降低|Smanjenje obrane neprijatelja dugog dometa|Riduzione difesa nemica a lungo raggio
50397439|Reducción de defensa de zombis bioquímicos enemigos|Giảm phòng thủ zombie sinh hóa địch|خفض دفاع زومبي العدو الكيميائي الحيوي|敵方生化殭屍防禦降低|Smanjenje obrane neprijateljskih biokemijskih zombija|Riduzione difesa zombi biochimici nemici
50397440|De débil a fuerte|Từ yếu thành mạnh|من الضعف إلى القوة|以弱勝強|Od slabog do jakog|Da debole a forte
50397448|Perforación de armadura|Xuyên giáp|اختراق الدرع|破甲|Proboj oklopa|Perforazione armatura
50397451|Guardia|Hộ vệ|الحراسة|守護|Straža|Guardia
50397452|Electrocución: daño continuo|Điện giật: sát thương liên tục|الصعقة: ضرر مستمر|電擊：持續傷害|Strujni udar: stalna šteta|Elettrocuzione: danni continui
50397453|Electrocución: reducción del daño del objetivo|Điện giật: giảm sát thương của mục tiêu|الصعقة: خفض ضرر الهدف|電擊：目標傷害降低|Strujni udar: smanjenje štete mete|Elettrocuzione: riduzione danni del bersaglio
50397454|Electrocución: aumento de daño recibido|Điện giật: tăng sát thương nhận vào|الصعقة: زيادة الضرر المتلقى|電擊：目標受傷增加|Strujni udar: povećanje primljene štete|Elettrocuzione: aumento danni subiti
50397455|Electrocución: probabilidad de activación|Điện giật: xác suất kích hoạt|الصعقة: احتمال التفعيل|電擊：觸發機率|Strujni udar: vjerojatnost aktivacije|Elettrocuzione: probabilità di attivazione
50397456|Honor de la guardia|Danh dự hộ vệ|شرف الحارس|守護榮耀|Čast straže|Onore della guardia
50397457|Rompeescudos|Phá khiên|كاسر الدرع|破盾|Razbijač štita|Spezzascudi
50397460|Reducción del daño recibido de titanes|Giảm sát thương nhận từ Titan|خفض الضرر من العمالقة|降低泰坦造成的傷害|Smanjenje štete od titana|Riduzione danni subiti dai titani
50397468|Escudo de energía|Khiên năng lượng|درع الطاقة|能量護盾|Energetski štit|Scudo energetico
50397469|Ataque aéreo|Không kích|غارة جوية|空襲|Zračni napad|Attacco aereo
50397513|Reducción de defensa enemiga|Giảm phòng thủ địch|خفض دفاع العدو|敵方防禦降低|Smanjenje neprijateljske obrane|Riduzione difesa nemica
50462870|Límite adicional de tropas en marcha|Giới hạn quân hành quân bổ sung|زيادة حد قوات المسير|行軍部隊數量加成上限|Dodatni limit postrojbi u pohodu|Limite aggiuntivo truppe in marcia
50462871|Ampliación de tropas en batalla entre naciones|Mở rộng quân chiến liên quốc gia|توسيع القوات في معركة الدول|跨國戰鬥部隊擴充|Proširenje postrojbi u međunacionalnoj bitci|Espansione truppe nelle battaglie tra nazioni
50462873|Límite de heridos|Giới hạn thương binh|حد الجرحى|傷兵上限|Limit ranjenika|Limite feriti
67174403|Petróleo|Dầu|النفط|石油|Nafta|Petrolio
67174409|Comida|Thức ăn|الطعام|食物|Hrana|Cibo
67240371|Plano del puerto|Bản thiết kế cảng|مخطط الميناء|港口圖紙|Nacrt luke|Progetto del porto
`;
for(const row of islandNameRows.trim().split('\n')){const [key,...v]=row.split('|');if(v.length!==islandExtraLanguages.length)throw Error('Island locale name count '+key);for(let i=0;i<v.length;i++)islandExtraNames[islandExtraLanguages[i]][key]=v[i]}
const fragmentParents={67698793:402653198,67698794:402653199,67698795:402653202,67698796:402653210,67698887:402653276,67698888:402653277,67698891:402653278,67698892:402653279,67698897:402653282,67698898:402653283};
for(const [k,id] of Object.entries(fragmentParents)){for(const lang of islandExtraLanguages){const n=islandExtraNames[lang][id];islandExtraNames[lang][k]={es:'Fragmento: '+n,vi:'Mảnh: '+n,ar:'شظية: '+n,zh:n+'碎片',hr:'Ulomak: '+n,it:'Frammento: '+n}[lang]}}
Object.assign(islandSetNames,{es:['Carnaval navideño','Jardín romántico','Parque infantil','Fiesta de Halloween','Verano refrescante','Ciudad cibernética'],vi:['Lễ hội Giáng sinh','Vườn lãng mạn','Sân chơi trẻ em','Tiệc Halloween','Mùa hè mát mẻ','Thành phố công nghệ'],ar:['كرنفال عيد الميلاد','حديقة رومانسية','ملعب الأطفال','حفلة الهالوين','صيف منعش','المدينة السيبرانية'],zh:['聖誕嘉年華','浪漫花園','兒童樂園','萬聖節派對','清涼夏日','賽博城市'],hr:['Božićni karneval','Romantični vrt','Dječje igralište','Noć vještica','Osvježavajuće ljeto','Kibernetički grad'],it:['Carnevale natalizio','Giardino romantico','Parco giochi','Festa di Halloween','Estate rinfrescante','Città cyber']});

const islandPortPlanWords={ru:['Прокачка всего порта','Общий расчёт четырёх сооружений','Вероятность электроразряда','Урон в секунду','Требуемый уровень не достигнут','Электроразряд: два самых многочисленных типа войск среднего и дальнего боя могут наложить эффект при атаке. Длительность — 4 секунды.'],en:['Upgrade entire harbor','Combined plan for four buildings','Electrocution chance','Damage per second','Required level not reached','Electrocution: the two most numerous mid- and long-range unit types may apply this effect when attacking. Duration: 4 seconds.'],es:['Mejorar todo el puerto','Plan conjunto de cuatro edificios','Probabilidad de electrocución','Daño por segundo','No se alcanza el nivel requerido','Electrocución: los dos tipos de unidades de alcance medio y largo más numerosos pueden aplicar el efecto al atacar. Dura 4 segundos.'],vi:['Nâng cấp toàn bộ cảng','Kế hoạch chung cho bốn công trình','Xác suất điện giật','Sát thương mỗi giây','Chưa đạt cấp yêu cầu','Điện giật: hai loại quân tầm trung và tầm xa có số lượng đông nhất có thể gây hiệu ứng khi tấn công. Kéo dài 4 giây.'],ar:['ترقية الميناء بالكامل','خطة مشتركة للمنشآت الأربع','احتمال الصعقة الكهربائية','الضرر في الثانية','لم يتم بلوغ المستوى المطلوب','الصعقة: يمكن لأكثر نوعين عدداً من الوحدات متوسطة وبعيدة المدى إحداث التأثير عند الهجوم. يستمر 4 ثوانٍ.'],zh:['升級整座港口','四座建築的整體計畫','電擊觸發機率','每秒傷害','未達所需等級','電擊：中遠程部隊中數量最多的兩種兵種在攻擊時可施加此效果。持續4秒。'],hr:['Nadogradnja cijele luke','Zajednički plan četiriju građevina','Vjerojatnost strujnog udara','Šteta po sekundi','Potrebna razina nije dosegnuta','Strujni udar: dvije najbrojnije vrste jedinica srednjeg i dugog dometa mogu izazvati učinak pri napadu. Traje 4 sekunde.'],it:['Potenzia tutto il porto','Piano combinato dei quattro edifici','Probabilità di elettrocuzione','Danni al secondo','Livello richiesto non raggiunto','Elettrocuzione: i due tipi di unità a medio e lungo raggio più numerosi possono applicare l’effetto attaccando. Dura 4 secondi.']};
