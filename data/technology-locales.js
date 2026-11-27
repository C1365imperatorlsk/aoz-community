const techLanguages=['ru','en','es','vi','ar','zh','hr','it'];
const techUiRows={
ru:'Технологии|Академия|Автозавод|Альянс|Все|Поиск технологии|Ресурсы|Развитие|Война|Оборона|Организация|Походы|Улучшения|Текущий уровень|Целевой уровень|Бонус скорости исследования, %|Стоимость|Базовое время|Время с бонусом|Мощь (значение уровня)|Бонус|Требования|Здание|Уровень|Не изучено|По уровням|Опыт исследования|Опыт за пожертвование (предварительно)|Ресурсы за пожертвование|Порог пожертвования (предварительно)|Сумма требований опыта|Нет числового эффекта|Изображение отсутствует|Названия справочные. Проверьте уровни, бонусы и время в игре.|Время рассчитано по модели деления на 1 + бонус/100. Не учитываются помощь и мгновенное завершение.|Требования не включены в стоимость. Уровни требований предварительные, сверьте их в игре.|Опыт и параметры пожертвований указаны по уровням. Сумма не означает подтверждённую стоимость развития альянса.|Ничего не найдено|Назад|Нефть|Еда|Сталь|Минералы|д|ч|м|с|Уровней|Технологий|Сбросить план|Сохранено на устройстве|Исследование|Предварительный расчёт|Неизвестный бонус|Суммарный план|Добавить зависимые исследования|Выбрано исследований|Сбросить все сохранённые планы?|Прогресс',
en:'Technologies|Academy|Garage|Alliance|All|Search technology|Resources|Development|War|Defense|Organization|Fleets|Upgrades|Current level|Target level|Research speed bonus, %|Cost|Base time|Time with bonus|Power (level value)|Effect|Requirements|Building|Level|Not researched|By level|Research XP|XP per donation (provisional)|Resources per donation|Donation threshold (provisional)|Sum of XP requirements|No numeric effect|Image unavailable|Reference names. Verify levels, effects and time in game.|Time uses the model base ÷ (1 + bonus/100). Excludes help and instant completion.|Prerequisites are not included in cost. Requirement levels are provisional; verify in game.|XP and donation parameters are shown by level. The sum is not a verified alliance upgrade cost.|No results|Back|Oil|Food|Steel|Minerals|d|h|m|s|Levels|Technologies|Reset plan|Saved on device|Research|Estimate|Unknown effect|Total plan|Include prerequisite research|Research selected|Reset all saved plans?|Progress',
es:'Tecnologías|Academia|Garaje|Alianza|Todas|Buscar tecnología|Recursos|Desarrollo|Guerra|Defensa|Organización|Marchas|Mejoras|Nivel actual|Nivel objetivo|Bonificación de investigación, %|Coste|Tiempo base|Tiempo con bonificación|Poder (valor del nivel)|Efecto|Requisitos|Edificio|Nivel|Sin investigar|Por nivel|EXP de investigación|EXP por donación (provisional)|Recursos por donación|Umbral de donación (provisional)|Suma de requisitos de EXP|Sin efecto numérico|Imagen no disponible|Nombres orientativos. Comprueba niveles, efectos y tiempo en el juego.|Tiempo: base ÷ (1 + bonificación/100). No incluye ayuda ni finalización instantánea.|Los requisitos no se incluyen en el coste. Niveles orientativos; comprueba en el juego.|EXP y donaciones por nivel. La suma no es un coste de alianza verificado.|Sin resultados|Atrás|Petróleo|Comida|Acero|Minerales|d|h|m|s|Niveles|Tecnologías|Restablecer plan|Guardado en el dispositivo|Investigación|Estimación|Efecto desconocido|Plan total|Incluir investigaciones requeridas|Investigaciones seleccionadas|¿Borrar todos los planes?|Progreso',
vi:'Công nghệ|Học viện|Nhà máy xe|Liên minh|Tất cả|Tìm công nghệ|Tài nguyên|Phát triển|Chiến tranh|Phòng thủ|Tổ chức|Đoàn quân|Nâng cấp|Cấp hiện tại|Cấp mục tiêu|Tăng tốc nghiên cứu, %|Chi phí|Thời gian cơ bản|Thời gian có thưởng|Sức mạnh (giá trị cấp)|Hiệu ứng|Yêu cầu|Công trình|Cấp|Chưa nghiên cứu|Theo cấp|KN nghiên cứu|KN mỗi lần quyên góp (tham khảo)|Tài nguyên mỗi lần quyên góp|Ngưỡng quyên góp (tham khảo)|Tổng yêu cầu KN|Không có hiệu ứng số|Chưa có hình|Tên tham khảo. Kiểm tra cấp, hiệu ứng và thời gian trong trò chơi.|Thời gian = cơ bản ÷ (1 + thưởng/100). Không tính trợ giúp và hoàn thành ngay.|Chi phí không gồm điều kiện trước. Cấp yêu cầu chỉ mang tính tham khảo; kiểm tra trong trò chơi.|KN và quyên góp theo cấp. Tổng không phải chi phí nâng cấp liên minh đã xác minh.|Không có kết quả|Quay lại|Dầu|Thực phẩm|Thép|Khoáng sản|ng|g|p|s|Cấp|Công nghệ|Đặt lại kế hoạch|Lưu trên thiết bị|Nghiên cứu|Ước tính|Hiệu ứng chưa rõ|Tổng kế hoạch|Gồm nghiên cứu điều kiện|Nghiên cứu đã chọn|Xóa mọi kế hoạch?|Tiến độ',
ar:'التقنيات|الأكاديمية|المرآب|التحالف|الكل|ابحث عن تقنية|الموارد|التطوير|الحرب|الدفاع|التنظيم|المسيرات|الترقيات|المستوى الحالي|المستوى المستهدف|مكافأة سرعة البحث، %|التكلفة|الوقت الأساسي|الوقت مع المكافأة|القوة (قيمة المستوى)|التأثير|المتطلبات|المبنى|المستوى|لم يُبحث|حسب المستوى|خبرة البحث|خبرة التبرع (تقديرية)|موارد التبرع|حد التبرع (تقديري)|مجموع متطلبات الخبرة|لا تأثير رقمي|الصورة غير متوفرة|أسماء مرجعية. تحقق من المستويات والتأثيرات والوقت في اللعبة.|الوقت الأساسي ÷ (1 + المكافأة/100). لا يشمل المساعدة أو الإكمال الفوري.|المتطلبات ليست ضمن التكلفة. مستويات المتطلبات تقديرية؛ تحقق في اللعبة.|الخبرة والتبرعات حسب المستوى. المجموع ليس تكلفة تحالف مؤكدة.|لا نتائج|رجوع|نفط|غذاء|فولاذ|معادن|ي|س|د|ث|مستويات|تقنيات|إعادة ضبط الخطة|محفوظ على الجهاز|بحث|تقدير|تأثير غير معروف|الخطة الإجمالية|تضمين الأبحاث المطلوبة|الأبحاث المحددة|حذف كل الخطط؟|التقدم',
zh:'科技|學院|車庫|聯盟|全部|搜尋科技|資源|發展|戰爭|防禦|組織|行軍|升級|目前等級|目標等級|研究速度加成，%|消耗|基礎時間|加成後時間|戰力（等級數值）|效果|條件|建築|等級|未研究|逐級|研究經驗|每次捐獻經驗（參考）|每次捐獻資源|捐獻門檻（參考）|經驗需求合計|無數值效果|尚無圖片|名稱僅供參考。請於遊戲內確認等級、效果及時間。|時間＝基礎 ÷（1 + 加成/100），不含協助或立即完成。|消耗不含前置條件。需求等級僅供參考，請於遊戲確認。|經驗與捐獻依等級顯示，合計並非經驗證的聯盟升級成本。|無結果|返回|石油|糧食|鋼材|礦物|天|時|分|秒|等級|科技|重設計畫|儲存於裝置|研究|估算|未知效果|總計畫|包含前置科技|已選研究|清除全部計畫？|進度',
hr:'Tehnologije|Akademija|Garaža|Savez|Sve|Traži tehnologiju|Resursi|Razvoj|Rat|Obrana|Organizacija|Pohodi|Nadogradnje|Trenutna razina|Ciljna razina|Bonus brzine istraživanja, %|Trošak|Osnovno vrijeme|Vrijeme s bonusom|Moć (vrijednost razine)|Učinak|Uvjeti|Zgrada|Razina|Nije istraženo|Po razinama|XP istraživanja|XP po donaciji (okvirno)|Resursi po donaciji|Prag donacije (okvirno)|Zbroj zahtjeva XP|Nema brojčanog učinka|Slika nije dostupna|Referentni nazivi. Provjerite razine, učinke i vrijeme u igri.|Vrijeme = osnovno ÷ (1 + bonus/100). Bez pomoći i trenutnog završetka.|Uvjeti nisu u trošku. Tražene razine su okvirne; provjerite u igri.|XP i donacije po razini. Zbroj nije potvrđen trošak saveza.|Nema rezultata|Natrag|Nafta|Hrana|Čelik|Minerali|d|h|m|s|Razine|Tehnologije|Poništi plan|Spremljeno na uređaju|Istraživanje|Procjena|Nepoznat učinak|Ukupni plan|Uključi preduvjete|Odabrana istraživanja|Izbrisati sve planove?|Napredak',
it:'Tecnologie|Accademia|Garage|Alleanza|Tutte|Cerca tecnologia|Risorse|Sviluppo|Guerra|Difesa|Organizzazione|Marce|Miglioramenti|Livello attuale|Livello obiettivo|Bonus velocità ricerca, %|Costo|Tempo base|Tempo con bonus|Potenza (valore livello)|Effetto|Requisiti|Edificio|Livello|Non ricercato|Per livello|PE ricerca|PE per donazione (indicativi)|Risorse per donazione|Soglia donazione (indicativa)|Somma requisiti PE|Nessun effetto numerico|Immagine non disponibile|Nomi indicativi. Verifica livelli, effetti e tempo nel gioco.|Tempo = base ÷ (1 + bonus/100). Esclude aiuti e completamento immediato.|Requisiti esclusi dal costo. Livelli dei requisiti indicativi; verifica nel gioco.|PE e donazioni per livello. La somma non è un costo alleanza verificato.|Nessun risultato|Indietro|Petrolio|Cibo|Acciaio|Minerali|g|h|m|s|Livelli|Tecnologie|Reimposta piano|Salvato sul dispositivo|Ricerca|Stima|Effetto sconosciuto|Piano totale|Includi ricerche prerequisite|Ricerche selezionate|Cancellare tutti i piani?|Progresso'};
const techKeys='title academy garage alliance all search resources development war defense organization fleets upgrades current target speed cost baseTime boostedTime power effect requirements building level locked steps xp donationXp donationCost donationReq xpSum noEffect noArt note timeNote reqNote allianceNote empty back oil food steel minerals day hour minute second levels technologies reset saved research estimate unknown totalPlan includeReq selected confirmReset progress'.split(' ');
const techWords=Object.fromEntries(Object.entries(techUiRows).map(([k,v])=>{const a=v.split('|');if(a.length!==techKeys.length)throw Error('Locale length '+k+' '+a.length);return [k,Object.fromEntries(techKeys.map((x,i)=>[x,a[i]]))]}));
const techNameRows=`Alliance Assistance|Помощь альянса|Ayuda de alianza|Hỗ trợ liên minh|مساعدة التحالف|聯盟援助|Pomoć saveza|Assistenza alleanza
Alliance Defense|Оборона альянса|Defensa de alianza|Phòng thủ liên minh|دفاع التحالف|聯盟防禦|Obrana saveza|Difesa alleanza
Architecture|Архитектура|Arquitectura|Kiến trúc|العمارة|建築學|Arhitektura|Architettura
Armor|Броня|Blindaje|Giáp|درع|裝甲|Oklop|Corazza
Civil Engineering|Строительство|Ingeniería civil|Xây dựng|الهندسة المدنية|土木工程|Graditeljstvo|Ingegneria civile
Depot|Склад|Depósito|Kho|المستودع|倉庫|Skladište|Deposito
Draft|Вербовка|Reclutamiento|Tuyển quân|التجنيد|招募|Novačenje|Reclutamento
Engine|Двигатель|Motor|Động cơ|المحرك|引擎|Motor|Motore
Expansion|Расширение|Expansión|Mở rộng|التوسع|擴編|Proširenje|Espansione
First Aid|Первая помощь|Primeros auxilios|Sơ cứu|الإسعافات الأولية|急救|Prva pomoć|Primo soccorso
Fleet|Поход|Marcha|Đoàn quân|مسيرة|行軍|Pohod|Marcia
Food Gather|Сбор еды|Recolección de comida|Thu thập thực phẩm|جمع الغذاء|糧食採集|Prikupljanje hrane|Raccolta cibo
Food Production|Производство еды|Producción de comida|Sản xuất thực phẩm|إنتاج الغذاء|糧食生產|Proizvodnja hrane|Produzione cibo
Fortify Lightning Orbs|Усиление электрических сфер|Refuerzo de orbes eléctricos|Cường hóa cầu điện|تعزيز الكرات الكهربائية|強化電球|Jačanje električnih kugli|Potenziamento sfere elettriche
Fortify Machine Gun|Усиление пулемёта|Refuerzo de ametralladora|Cường hóa súng máy|تعزيز الرشاش|強化機槍|Jačanje strojnice|Potenziamento mitragliatrice
Fortify Missile|Усиление ракет|Refuerzo de misiles|Cường hóa tên lửa|تعزيز الصواريخ الموجهة|強化導彈|Jačanje projektila|Potenziamento missili
Fortify Rocket|Усиление реактивных снарядов|Refuerzo de cohetes|Cường hóa rocket|تعزيز الصواريخ|強化火箭|Jačanje raketa|Potenziamento razzi
Fuel Up|Заправка|Repostaje|Nạp nhiên liệu|التزود بالوقود|補充燃料|Punjenje goriva|Rifornimento
GPS|GPS|GPS|GPS|GPS|GPS|GPS|GPS
Gather Equipment|Снаряжение для сбора|Equipo de recolección|Thiết bị thu thập|معدات الجمع|採集裝備|Oprema za prikupljanje|Equipaggiamento raccolta
Help Time|Время помощи|Tiempo de ayuda|Thời gian hỗ trợ|وقت المساعدة|協助時間|Vrijeme pomoći|Tempo di aiuto
Laser|Лазер|Láser|Laser|ليزر|雷射|Laser|Laser
Leadership|Лидерство|Liderazgo|Lãnh đạo|القيادة|領導力|Vodstvo|Leadership
Lightning Orb Cooldown|Перезарядка электрических сфер|Recarga de orbes eléctricos|Hồi chiêu cầu điện|تبريد الكرات الكهربائية|電球冷卻|Hlađenje električnih kugli|Ricarica sfere elettriche
Load|Грузоподъёмность|Carga|Tải trọng|الحمولة|負重|Nosivost|Carico
Load Boost|Увеличение грузоподъёмности|Aumento de carga|Tăng tải trọng|زيادة الحمولة|負重提升|Povećanje nosivosti|Aumento carico
Long-Range Armor|Броня дальнего боя|Blindaje a distancia|Giáp tầm xa|درع بعيد المدى|遠程裝甲|Oklop dalekog dometa|Corazza lungo raggio
Long-Range Attack|Атака дальнего боя|Ataque a distancia|Tấn công tầm xa|هجوم بعيد المدى|遠程攻擊|Napad dalekog dometa|Attacco lungo raggio
Long-Range Defense|Защита дальнего боя|Defensa a distancia|Phòng thủ tầm xa|دفاع بعيد المدى|遠程防禦|Obrana dalekog dometa|Difesa lungo raggio
Long-Range HP|Здоровье дальнего боя|PV a distancia|HP tầm xa|صحة بعيد المدى|遠程生命|HP dalekog dometa|PV lungo raggio
Long-Range Weapons|Оружие дальнего боя|Armas a distancia|Vũ khí tầm xa|أسلحة بعيدة المدى|遠程武器|Oružje dalekog dometa|Armi lungo raggio
Machine Gun Cooldown|Перезарядка пулемёта|Recarga de ametralladora|Hồi chiêu súng máy|تبريد الرشاش|機槍冷卻|Hlađenje strojnice|Ricarica mitragliatrice
Magnet Grenade|Магнитная граната|Granada magnética|Lựu đạn từ tính|قنبلة مغناطيسية|磁力手榴彈|Magnetska granata|Granata magnetica
Medical Facilities|Медицинские учреждения|Instalaciones médicas|Cơ sở y tế|مرافق طبية|醫療設施|Medicinske ustanove|Strutture mediche
Medicine|Медицина|Medicina|Y học|الطب|醫學|Medicina|Medicina
Melee Armor|Броня ближнего боя|Blindaje cuerpo a cuerpo|Giáp cận chiến|درع قريب المدى|近戰裝甲|Oklop bliske borbe|Corazza mischia
Melee Attack|Атака ближнего боя|Ataque cuerpo a cuerpo|Tấn công cận chiến|هجوم قريب المدى|近戰攻擊|Napad bliske borbe|Attacco mischia
Melee Defense|Защита ближнего боя|Defensa cuerpo a cuerpo|Phòng thủ cận chiến|دفاع قريب المدى|近戰防禦|Obrana bliske borbe|Difesa mischia
Melee HP|Здоровье ближнего боя|PV cuerpo a cuerpo|HP cận chiến|صحة قريب المدى|近戰生命|HP bliske borbe|PV mischia
Melee Weapons|Оружие ближнего боя|Armas cuerpo a cuerpo|Vũ khí cận chiến|أسلحة قريبة المدى|近戰武器|Oružje bliske borbe|Armi mischia
Mid-Range Armor|Броня среднего боя|Blindaje alcance medio|Giáp tầm trung|درع متوسط المدى|中程裝甲|Oklop srednjeg dometa|Corazza medio raggio
Mid-Range Attack|Атака среднего боя|Ataque alcance medio|Tấn công tầm trung|هجوم متوسط المدى|中程攻擊|Napad srednjeg dometa|Attacco medio raggio
Mid-Range Defense|Защита среднего боя|Defensa alcance medio|Phòng thủ tầm trung|دفاع متوسط المدى|中程防禦|Obrana srednjeg dometa|Difesa medio raggio
Mid-Range HP|Здоровье среднего боя|PV alcance medio|HP tầm trung|صحة متوسط المدى|中程生命|HP srednjeg dometa|PV medio raggio
Mid-Range Weapons|Оружие среднего боя|Armas alcance medio|Vũ khí tầm trung|أسلحة متوسطة المدى|中程武器|Oružje srednjeg dometa|Armi medio raggio
Mineral Boost|Увеличение добычи минералов|Aumento de minerales|Tăng khoáng sản|زيادة المعادن|礦物提升|Povećanje minerala|Aumento minerali
Mineral Gather|Сбор минералов|Recolección de minerales|Thu thập khoáng sản|جمع المعادن|礦物採集|Prikupljanje minerala|Raccolta minerali
Mineral Output|Производство минералов|Producción de minerales|Sản xuất khoáng sản|إنتاج المعادن|礦物生產|Proizvodnja minerala|Produzione minerali
Missile Cooldown|Перезарядка ракет|Recarga de misiles|Hồi chiêu tên lửa|تبريد الصواريخ الموجهة|導彈冷卻|Hlađenje projektila|Ricarica missili
Oil Gather|Сбор нефти|Recolección de petróleo|Thu thập dầu|جمع النفط|石油採集|Prikupljanje nafte|Raccolta petrolio
Oil Output|Производство нефти|Producción de petróleo|Sản xuất dầu|إنتاج النفط|石油生產|Proizvodnja nafte|Produzione petrolio
Oil Production|Производство нефти|Producción de petróleo|Sản xuất dầu|إنتاج النفط|石油生產|Proizvodnja nafte|Produzione petrolio
Plant Flags|Установка флагов|Colocación de banderas|Cắm cờ|وضع الأعلام|設置旗幟|Postavljanje zastava|Posizionamento bandiere
Raid|Рейд|Incursión|Đột kích|غارة|突襲|Prepad|Incursione
Rally Organization|Организация сбора|Organización de reunión|Tổ chức tập kết|تنظيم الحشد|集結組織|Organizacija okupljanja|Organizzazione raduno
Rapid Fleet|Быстрый поход|Marcha rápida|Đoàn quân nhanh|مسيرة سريعة|快速行軍|Brzi pohod|Marcia rapida
Rescue|Спасение|Rescate|Cứu hộ|الإنقاذ|救援|Spašavanje|Soccorso
Research|Исследования|Investigación|Nghiên cứu|البحث|研究|Istraživanje|Ricerca
Research Focus|Упор на исследования|Enfoque en investigación|Tập trung nghiên cứu|التركيز على البحث|研究專精|Usmjereno istraživanje|Focus ricerca
Rocket Cooldown|Перезарядка реактивных снарядов|Recarga de cohetes|Hồi chiêu rocket|تبريد الصواريخ|火箭冷卻|Hlađenje raketa|Ricarica razzi
Shield|Щит|Escudo|Khiên|درع|護盾|Štit|Scudo
Spelunking|Добыча золота|Exploración de cuevas|Khai thác vàng|استكشاف الكهوف|黃金採集|Istraživanje špilja|Esplorazione grotte
Steel Gather|Сбор стали|Recolección de acero|Thu thập thép|جمع الفولاذ|鋼材採集|Prikupljanje čelika|Raccolta acciaio
Steel Production|Производство стали|Producción de acero|Sản xuất thép|إنتاج الفولاذ|鋼材生產|Proizvodnja čelika|Produzione acciaio
Sturdy Defense|Прочная оборона|Defensa resistente|Phòng thủ vững chắc|دفاع متين|堅固防禦|Čvrsta obrana|Difesa robusta
Tax Collection|Сбор налогов|Recaudación de impuestos|Thu thuế|تحصيل الضرائب|稅收|Prikupljanje poreza|Riscossione tasse
Tax Rate|Налоговая ставка|Tasa impositiva|Thuế suất|معدل الضريبة|稅率|Porezna stopa|Aliquota fiscale
Team Expansion|Расширение команды|Expansión del equipo|Mở rộng đội|توسيع الفريق|隊伍擴編|Proširenje tima|Espansione squadra
Tech Explosion|Технологический прорыв|Explosión tecnológica|Bùng nổ công nghệ|انفجار تقني|科技突破|Tehnološki proboj|Esplosione tecnologica`;
const techNames=Object.fromEntries(techNameRows.split('\n').map(line=>{const [key,...v]=line.split('|');if(v.length!==7)throw Error(key);return [key,Object.fromEntries(['ru','es','vi','ar','zh','hr','it'].map((l,i)=>[l,v[i]]))]}));
const techEffectRows=`Technology Research|Скорость исследования|Velocidad de investigación|Tốc độ nghiên cứu|سرعة البحث|研究速度|Brzina istraživanja|Velocità ricerca
Increase Max Wounded Units|Лимит раненых (бонус)|Límite de heridos (bono)|Giới hạn thương binh (thưởng)|حد الجرحى (مكافأة)|傷兵上限（加成）|Limit ranjenih (bonus)|Limite feriti (bonus)
Depot Capacity|Вместимость склада|Capacidad del depósito|Sức chứa kho|سعة المستودع|倉庫容量|Kapacitet skladišta|Capacità deposito
Healing Speed|Скорость лечения|Velocidad de curación|Tốc độ chữa trị|سرعة العلاج|治療速度|Brzina liječenja|Velocità cura
Transport Tax|Налог на перевозку|Impuesto de transporte|Thuế vận chuyển|ضريبة النقل|運輸稅|Porez na prijevoz|Tassa trasporto
Wounded Ratio|Доля раненых|Proporción de heridos|Tỷ lệ thương binh|نسبة الجرحى|傷兵比例|Udio ranjenih|Percentuale feriti
Building Speed Bonus|Скорость строительства|Velocidad de construcción|Tốc độ xây dựng|سرعة البناء|建造速度|Brzina gradnje|Velocità costruzione
Mobility Recovery|Восстановление мобильности|Recuperación de movilidad|Hồi phục cơ động|استعادة الحركة|行動力恢復|Obnova mobilnosti|Recupero mobilità
Recruitment Speed Up|Скорость вербовки|Velocidad de reclutamiento|Tốc độ tuyển quân|سرعة التجنيد|招募速度|Brzina novačenja|Velocità reclutamento
Fleet Speed|Скорость похода|Velocidad de marcha|Tốc độ hành quân|سرعة المسيرة|行軍速度|Brzina pohoda|Velocità marcia
Fleet Troops Units Limit|Лимит войск похода|Límite de tropas de marcha|Giới hạn quân hành quân|حد قوات المسيرة|行軍部隊上限|Limit postrojbi pohoda|Limite truppe marcia
Monster Attack Speed|Скорость атаки монстров|Velocidad de ataque a monstruos|Tốc độ tấn công quái|سرعة مهاجمة الوحوش|攻擊怪物速度|Brzina napada na čudovišta|Velocità attacco mostri
Max Recruitment|Лимит вербовки|Límite de reclutamiento|Giới hạn tuyển quân|حد التجنيد|招募上限|Limit novačenja|Limite reclutamento
City Defense Limit|Лимит обороны города|Límite de defensa urbana|Giới hạn phòng thủ thành|حد دفاع المدينة|城市防禦上限|Limit gradske obrane|Limite difesa città
City Troops HP|Здоровье войск города|PV de tropas urbanas|HP quân trong thành|صحة قوات المدينة|城內部隊生命|HP gradskih postrojbi|PV truppe città
Vehicle Queue|Количество походов|Número de marchas|Số đoàn quân|عدد المسيرات|行軍隊列|Broj pohoda|Numero marce
Wounded Units Limit|Лимит раненых|Límite de heridos|Giới hạn thương binh|حد الجرحى|傷兵上限|Limit ranjenih|Limite feriti
Gather Speed Boost|Скорость сбора|Velocidad de recolección|Tốc độ thu thập|سرعة الجمع|採集速度|Brzina prikupljanja|Velocità raccolta
Ally Defense Max|Лимит подкреплений союзника|Límite de refuerzos aliados|Giới hạn viện quân đồng minh|حد تعزيزات الحليف|盟友增援上限|Limit savezničkih pojačanja|Limite rinforzi alleati
Market Tax|Рыночный налог|Impuesto de mercado|Thuế chợ|ضريبة السوق|市場稅|Tržišni porez|Tassa mercato
Increases max number of Alliance Flags|Лимит флагов альянса|Límite de banderas de alianza|Giới hạn cờ liên minh|حد أعلام التحالف|聯盟旗幟上限|Limit zastava saveza|Limite bandiere alleanza
Max Rally Units|Лимит войск сбора|Límite de tropas de reunión|Giới hạn quân tập kết|حد قوات الحشد|集結部隊上限|Limit postrojbi okupljanja|Limite truppe raduno
Rally Commanders Limit|Лимит командиров сбора|Límite de comandantes de reunión|Giới hạn chỉ huy tập kết|حد قادة الحشد|集結指揮官上限|Limit zapovjednika okupljanja|Limite comandanti raduno`;
const techEffectTranslations=Object.fromEntries(techEffectRows.split('\n').map(line=>{const [key,...v]=line.split('|');if(v.length!==7)throw Error(key);return [key,Object.fromEntries(['ru','es','vi','ar','zh','hr','it'].map((l,i)=>[l,v[i]]))]}));
const techEffectAliases={'Food Boost':'Food Production','Oil Gather Bonus':'Oil Gather','Steel Boost':'Steel Production','Food Gather Bonus':'Food Gather','Oil Boost':'Oil Production','Mineral Gather Bonus':'Mineral Gather','Gold Gather Bonus':'Spelunking','Mineral Production':'Mineral Output','Steel Gather Bonus':'Steel Gather'};
function techName(item,lang){return lang==='en'?item.name:(techNames[item.base]?.[lang]??item.base)+item.suffix}
function techEffectName(id,lang){const name=technologyEffectNames[id];return lang==='en'?name:(techEffectTranslations[name]?.[lang]??techNames[techEffectAliases[name]??name]?.[lang]??name)}
