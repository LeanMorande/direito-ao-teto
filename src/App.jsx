import { createElement as h, useState, useEffect, useRef } from 'react';
const P={
home:'<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
right:'<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
left:'<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
dl:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
lock:'<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
drop:'<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
euro:'<path d="M4 10h12"/><path d="M4 14h9"/><path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2"/>',
print:'<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/>',
pen:'<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>',
bank:'<line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/>',
badge:'<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
check:'<path d="M20 6 9 17l-5-5"/>',
tri:'<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>'};
const I=({n,s=24})=>h('svg',{width:s,height:s,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:2,strokeLinecap:'round',strokeLinejoin:'round','aria-hidden':'true',className:'shrink-0',dangerouslySetInnerHTML:{__html:P[n]}});

/* ---------- Textos da interface: [PT, ES, Kriolu] ---------- */
const S={
mov:['Ferramenta cívica · Vida Justa','Herramienta cívica · Vida Justa','Ferramenta sívika · Vida Justa'],
tag:['O seu requerimento para a Câmara Municipal, em 2 minutos.','Su requerimiento para la Câmara Municipal, en 2 minutos.','Bu rekerimentu pa Kamara Munisipal, na 2 minutu.'],
priv:['Os seus dados ficam só neste telemóvel. Nada é enviado nem guardado.','Sus datos se quedan solo en este teléfono. No se envía ni se guarda nada.','Bu dadus ta fika so na kel telefoni li. Nada ka ta bai ni ta ser guardadu.'],
pdf:['O documento final é sempre em português formal.','El documento final siempre está en portugués formal.','Kel papel final ta sta sempri na purtuguês formal.'],
pas:['Passo','Paso','Pasu'],
st:[['Pedido','Câmara','Dados','Situação','Rever'],['Pedido','Municipio','Datos','Situación','Revisar'],['Pidi','Kamara','Dadus','Situason','Revê']],
q0:['O que precisa?','¿Qué necesita?','Ki ki bu pursiza?'],
q1:['Qual é a sua Câmara Municipal?','¿Cuál es su Câmara Municipal?','Kal ki é bu Kamara Munisipal?'],
mun:['Concelho (município)','Concelho (municipio)','Konselhu (munisípiu)'],
munh:['Escolha na lista ou escreva o nome.','Elija de la lista o escriba el nombre.','Skodja na lista o skrebe nómi.'],
q2:['Os seus dados','Sus datos','Bu dadus'],
nome:['Nome completo','Nombre completo','Nómi kompletu'],
doc:['NIF ou NISS (opcional)','NIF o NISS (opcional)','NIF o NISS (ka ta obrigatóriu)'],
doch:['Só números. Pode deixar em branco.','Solo números. Puede dejarlo en blanco.','So númeru. Bu pode dexa na branku.'],
mor:['Morada / Bairro','Domicilio / Barrio','Enderesu / Bairu'],
tel:['Telemóvel','Teléfono móvil','Telefoni'],
q3:['A sua situação','Su situación','Bu situason'],
viv:['Na sua casa vive…','En su casa vive…','Na bu kasa ta mora…'],
kids:['Crianças ou menores a cargo','Niños o menores a cargo','Kriansa o menor di bu kargu'],
old:['Pessoa com 65 anos ou mais','Persona de 65 años o más','Pesoa ku 65 anu o mas'],
dis:['Pessoa com deficiência ou doença crónica','Persona con discapacidad o enfermedad crónica','Pesoa ku defisiénsia o duénsa kronika'],
why:['O que está a acontecer?','¿Qué está pasando?','Ki ki sta kontise?'],
w:{despejo:['Vou ser despejado(a)','Me van a desalojar','N ta ser dispejadu'],demol:['A minha casa vai ser demolida','Van a demoler mi casa','Nha kasa ta ser demolidu'],semcasa:['Fiquei sem casa','Me quedé sin vivienda','N fika sen kasa'],precaria:['Vivo sem condições dignas','Vivo sin condiciones dignas','N ta vive sen kondison dinhu']},
srv:['Serviço cortado','Servicio cortado','Sirvisu kortadu'],
sv:{agua:['Água','Agua','Agu'],luz:['Eletricidade','Electricidad','Luz'],ambos:['Água e eletricidade','Agua y electricidad','Agu ku luz']},
rent:['Renda mensal (euros)','Alquiler mensual (euros)','Renda di més (euru)'],
arr:['Meses de renda em atraso','Meses de alquiler atrasados','Més di renda atrazadu'],
dta:['Data limite, se tiver','Fecha límite, si la tiene','Data limiti, si ku ten'],
dtb:['Cortado desde','Cortado desde','Kortadu des di'],
dtc:['Prazo para pagar, se tiver','Plazo para pagar, si lo tiene','Prazu pa paga, si ku ten'],
ext:['Quer acrescentar algo? (opcional)','¿Quiere añadir algo? (opcional)','Bu kre djunta algu? (ka ta obrigatóriu)'],
exth:['Vai para o PDF tal como escrever. Se puder, escreva em português.','Va al PDF tal como lo escriba. Si puede, escriba en portugués.','Ta bai pa PDF sima ki bu skrebe. Si bu pode, skrebe na purtuguês.'],
q4:['Rever e criar o documento','Revisar y crear el documento','Revê i kria dokumentu'],
decl:['Declaro que tudo o que escrevi é verdade.','Declaro que todo lo que escribí es verdad.','N ta djura ma tudu ki n skrebe é verdadi.'],
mk:['Criar PDF','Crear PDF','Kria PDF'],
mking:['A criar…','Creando…','Ta kria…'],
next:['Continuar','Continuar','Kontinua'],back:['Voltar','Atrás','Bolta'],
e:{req:['Preencha este campo.','Rellene este campo.','Preenxe es kanpu.'],tel:['Número inválido.','Número no válido.','Númeru ka sta sértu.'],doc:['Número inválido. Confira ou deixe em branco.','Número no válido. Revíselo o déjelo en blanco.','Númeru ka sta sértu. Konfere o dexa na branku.'],ok:['Marque a caixa para continuar.','Marque la casilla para continuar.','Marka kel kaxa pa kontinua.']},
fail:['Não foi possível criar o PDF. Verifique a internet e tente outra vez.','No se pudo crear el PDF. Revise internet e inténtelo otra vez.','Ka konsigi kria PDF. Odja internet i tenta di novu.'],
dT:['O seu requerimento está pronto','Su requerimiento está listo','Bu rekerimentu sta pronto'],
dS:['Agora siga estes 4 passos.','Ahora siga estos 4 pasos.','Gosi sigi es 4 pasu.'],
rec:['RECEBIDO','RECIBIDO','RESEBIDU'],
aft:['A Câmara tem, em regra, 90 dias para responder. Guarde sempre a sua cópia carimbada.','La Câmara tiene, por regla general, 90 días para responder. Guarde siempre su copia sellada.','Kamara ten, normalmenti, 90 dia pa responde. Guarda sempri bu kópia karimbadu.'],
help:['Emergência 112 · Linha Nacional de Emergência Social 144 · Provedor de Justiça: provedor-jus.pt','Emergencia 112 · Línea Nacional de Emergencia Social 144 · Defensor del Pueblo (Provedor de Justiça): provedor-jus.pt','Emerjénsia 112 · Linha Nasional di Emerjénsia Sosial 144 · Provedor di Justisa: provedor-jus.pt'],
again:['Descarregar outra vez','Descargar otra vez','Baxa otu bês'],
wipe:['Apagar tudo e recomeçar','Borrar todo y empezar de nuevo','Paga tudu i kumesa di novu'],
disc:['Ferramenta de apoio cívico, gratuita e sem fins lucrativos. Não substitui aconselhamento jurídico.','Herramienta de apoyo cívico, gratuita y sin ánimo de lucro. No sustituye el asesoramiento jurídico.','Ferramenta di djuda sívika, di grasa. Ka ta substitui konsedju djuridiku.'],
a11y:[['Diminuir o texto','Aumentar o texto'],['Reducir el texto','Aumentar el texto'],['Mindjura letra','Aumenta letra']]};
const SC=[
{id:'a',ic:'home',t:['Casa / realojamento de emergência','Vivienda / realojo de emergencia','Kasa / alojamentu di emerjénsia'],d:['Despejo, demolição ou sem casa','Desalojo, demolición o sin vivienda','Dispejo, demolison o sen kasa']},
{id:'b',ic:'drop',t:['Água ou luz cortada','Agua o luz cortada','Agu o luz kortadu'],d:['Reposição urgente do serviço','Reposición urgente del servicio','Pa pui sirvisu di volta dipresa']},
{id:'c',ic:'euro',t:['Ajuda com a renda','Ayuda con el alquiler','Djuda ku renda di kasa'],d:['Apoio económico urgente','Apoyo económico urgente','Djuda di dinheru urjenti']}];
const DS=[
{ic:'print',t:['Imprima 2 cópias','Imprima 2 copias','Imprimi 2 kópia'],d:['Uma fica consigo. Sem impressora? Peça numa junta de freguesia, biblioteca ou papelaria.','Una se queda con usted. ¿Sin impresora? Pídalo en la junta de freguesia, biblioteca o papelería.','Un ta fika ku bo. Sen impresora? Pidi na junta di fregizia, bibliotéka o papelaria.']},
{ic:'pen',t:['Assine','Firme','Asina'],d:['Assine na linha final, igual ao seu documento de identificação.','Firme en la línea final, igual que en su documento de identidad.','Asina na ultima linha, sima na bu dokumentu di identifikason.']},
{ic:'bank',t:['Entregue na Câmara','Entregue en la Câmara','Entrega na Kamara'],d:['No balcão de atendimento da Câmara Municipal. Leve o seu documento de identificação e os comprovativos que tiver.','En la ventanilla de atención de la Câmara Municipal. Lleve su documento de identidad y los comprobantes que tenga.','Na balkon di atendimentu di Kamara Munisipal. Leva bu dokumentu di identifikason ku papel ki bu ten.']},
{ic:'badge',t:['Exija o carimbo de receção','Exija el sello de recepción','Eziji karimbu di resepson'],d:['Peça que carimbem e assinem a SUA cópia, com data e número de entrada. É a sua prova. Se recusarem, envie por correio registado com aviso de receção e peça o Livro de Reclamações.','Pida que sellen y firmen SU copia, con fecha y número de entrada. Es su prueba. Si se niegan, envíela por correo certificado con acuse de recibo y pida el Libro de Reclamaciones.','Pidi pa karimba i asina bu kópia, ku data i númeru di entrada. É bu prova. Si es nega, manda pa korreiu rejistadu ku avizu di resepson i pidi Livru di Reklamason.']}];
const MUN=['Lisboa','Amadora','Odivelas','Loures','Sintra','Oeiras','Cascais','Mafra','Vila Franca de Xira','Almada','Seixal','Barreiro','Moita','Montijo','Palmela','Setúbal','Porto','Vila Nova de Gaia','Matosinhos','Gondomar','Maia','Valongo','Espinho','Póvoa de Varzim','Vila do Conde','Santa Maria da Feira'];

/* ---------- Texto jurídico do PDF (sempre português de Portugal) ---------- */
const fd=s=>new Date(s+'T12:00:00').toLocaleDateString('pt-PT',{day:'numeric',month:'long',year:'numeric'});
const nifOk=v=>{let s=0;for(let i=0;i<8;i++)s+=v[i]*(9-i);let c=11-s%11;if(c>9)c=0;return c==v[8]};
function texto(f){
 const mun=f.mun.trim().replace(/^c[âa]mara\s+municipal\s+d[eoa]s?\s+/i,''),dt=f.dt?fd(f.dt):'';
 const sv={agua:'água',luz:'energia elétrica',ambos:'água e energia elétrica'}[f.srv];
 const lm='Lei n.º 75/2013, de 12 de setembro (Regime Jurídico das Autarquias Locais)';
 const vs=[f.kids&&'o agregado familiar incluir menores a cargo, cujo superior interesse deve ser salvaguardado (art. 69.º da CRP e arts. 3.º e 27.º da Convenção sobre os Direitos da Criança)',f.old&&'o agregado integrar pessoa com 65 ou mais anos de idade (art. 72.º da CRP)',f.dis&&'o agregado integrar pessoa com deficiência ou doença crónica (arts. 64.º e 71.º da CRP)'].filter(Boolean);
 const lbh='A Lei de Bases da Habitação (Lei n.º 83/2019, de 3 de setembro) estabelece que o Estado é o garante do direito à habitação (arts. 2.º, 3.º e 7.º)';
 const art13='no seu art. 13.º, impede as entidades públicas de promoverem o despejo de pessoas ou famílias vulneráveis sem que estejam previamente asseguradas soluções de realojamento, cabendo ao Município, à Segurança Social e ao IHRU, I.P., acompanhar a situação e diligenciar por essas soluções.';
 let subject,facts,law,asks;
 if(f.sc==='a'){
  const r={despejo:'iminente perda da habitação por despejo'+(dt?', com data limite de desocupação fixada para '+dt:''),demol:'iminente perda da habitação por demolição'+(dt?', com data limite fixada para '+dt:''),semcasa:'falta de habitação, vivendo em situação de sem-abrigo ou de alojamento precário',precaria:'habitação sem condições mínimas de dignidade (precariedade, insalubridade, insegurança ou sobrelotação)'}[f.why];
  subject='Pedido urgente de realojamento de emergência e de alternativa habitacional';
  facts=['O(A) requerente reside, com o seu agregado familiar, na morada acima indicada, encontrando-se em situação de '+r+'.','O(A) requerente não dispõe de meios económicos que lhe permitam assegurar, por si, uma solução habitacional alternativa adequada.'];
  law=['O art. 65.º, n.ºs 1 e 2, da Constituição da República Portuguesa (CRP) reconhece a todos, para si e para a sua família, o direito a uma habitação de dimensão adequada, em condições de higiene e conforto e que preserve a intimidade pessoal e a privacidade familiar, incumbindo ao Estado, em colaboração com as autarquias locais, promover a construção de habitações económicas e sociais.',
  lbh+' e, '+art13,
  'O Decreto-Lei n.º 37/2018, de 4 de junho (Programa 1.º Direito), no seu art. 5.º, identifica como situações de carência habitacional, entre outras, a precariedade, a insalubridade e insegurança e a sobrelotação ou inadequação da habitação, devendo o Município promover respostas através da sua Estratégia Local de Habitação.',
  'O Município dispõe de atribuições nos domínios da habitação e da ação social (art. 23.º, n.º 2, da '+lm+').',
  'Releva ainda o direito internacional vinculativo para Portugal (art. 8.º, n.º 2, da CRP): o art. 11.º do Pacto Internacional sobre os Direitos Económicos, Sociais e Culturais, o art. 8.º da Convenção Europeia dos Direitos Humanos e, quanto a menores, os arts. 3.º e 27.º da Convenção sobre os Direitos da Criança, que exigem a ponderação da proporcionalidade de qualquer despejo ou demolição e a procura de alternativa habitacional (cf. Comentário Geral n.º 7 do Comité dos Direitos Económicos, Sociais e Culturais da ONU).'];
  asks=['o atendimento e a avaliação urgentes da situação do agregado pelos serviços municipais de Ação Social e Habitação;','a atribuição de uma solução de alojamento de emergência e, subsequentemente, de habitação adequada, no âmbito da Estratégia Local de Habitação e do Programa 1.º Direito;','a articulação imediata com a Segurança Social e o IHRU, I.P., nos termos do art. 13.º da Lei n.º 83/2019;','que, enquanto não estiver assegurada alternativa habitacional, o Município não promova qualquer despejo, desocupação ou demolição da habitação do(a) requerente e diligencie junto das demais entidades competentes pela suspensão de tais medidas.'];
 }else if(f.sc==='b'){
  subject='Pedido de reposição urgente do fornecimento de '+sv;
  facts=['O fornecimento de '+sv+' à habitação do(a) requerente encontra-se interrompido'+(dt?' desde '+dt:'')+', privando o agregado familiar de um serviço público essencial.','Caso exista dívida, o(a) requerente não dispõe de meios para a liquidar de imediato, pelo que se propõe o seu pagamento prestacional.'];
  law=['O fornecimento de água e de energia elétrica constitui serviço público essencial (art. 1.º, n.º 2, da Lei n.º 23/96, de 26 de julho - Lei dos Serviços Públicos Essenciais), devendo o prestador proceder de boa-fé e em conformidade com a natureza essencial do serviço (art. 3.º) e cumprir o dever de informação (art. 4.º).',
  'A prestação do serviço não pode ser suspensa sem pré-aviso adequado, salvo caso fortuito ou de força maior, e a suspensão por mora do utente só é admissível após advertência por escrito, com antecedência mínima de 20 dias, indicando o motivo e os meios para a evitar (art. 5.º, n.ºs 1 e 2). A suspensão efetuada sem esse pré-aviso é ilegal e deve ser revertida de imediato.',
  'O utente tem direito à quitação parcial (art. 6.º) e o direito ao recebimento do preço do serviço prescreve no prazo de seis meses após a sua prestação (art. 10.º da mesma Lei).',
  'A privação de água e de energia numa habitação afeta o núcleo essencial do direito a uma habitação em condições de higiene e conforto (art. 65.º, n.º 1, da CRP), a dignidade da pessoa humana (art. 1.º da CRP) e o direito à saúde (art. 64.º da CRP), sendo condigna a habitação servida por redes adequadas de infraestruturas e serviços (art. 15.º da Lei n.º 83/2019). A Assembleia Geral da ONU reconheceu o acesso à água potável e ao saneamento como direito humano (Resolução 64/292, de 2010).',
  'Existem mecanismos de proteção de agregados vulneráveis, nomeadamente a tarifa social de energia elétrica (Decreto-Lei n.º 138-A/2010, de 28 de dezembro) e o tarifário social do serviço de águas, quando aplicável.',
  'O Município dispõe de atribuições em matéria de ambiente e saneamento básico, defesa do consumidor e ação social (art. 23.º, n.º 2, da '+lm+'), cabendo-lhe, como entidade titular dos serviços municipais ou junto da entidade gestora, assegurar a defesa dos direitos do utente.'];
  asks=['a reposição imediata do fornecimento de '+sv+' à habitação do(a) requerente, no prazo máximo de 24 horas, diligenciando a Câmara, para o efeito, junto da entidade gestora ou prestadora do serviço;','a verificação do cumprimento do pré-aviso e dos demais requisitos do art. 5.º da Lei n.º 23/96 e, caso não tenham sido cumpridos, que não sejam cobrados ao(à) requerente quaisquer custos de religação;','a aplicação da tarifa social e, se existir dívida, a celebração de um plano de pagamento prestacional compatível com os rendimentos do agregado;','a sinalização da situação aos serviços municipais de Ação Social, para acompanhamento do agregado.'];
 }else{
  const ar=+f.arr||0;
  subject='Pedido de apoio económico urgente ao arrendamento e de resposta de emergência social';
  facts=['O(A) requerente reside em habitação arrendada, pela qual paga a renda mensal de '+f.rent.trim().replace('.',',')+' euros'+(ar>0?', encontrando-se com '+ar+' mês(es) de renda em atraso':'')+', por perda ou redução dos rendimentos do agregado.','O(A) requerente corre o risco de perder a habitação'+(dt?', tendo como prazo limite '+dt:'')+', sem alternativa habitacional, por não dispor de meios económicos para ultrapassar a situação.'];
  law=['O art. 65.º da CRP reconhece o direito de todos a uma habitação adequada e incumbe ao Estado adotar uma política tendente a estabelecer um sistema de renda compatível com o rendimento familiar (n.º 3); o art. 63.º da CRP assegura proteção nas situações de falta ou diminuição de meios de subsistência.',
  lbh+', consagra o direito à proteção da habitação permanente (art. 10.º) e, '+art13,
  'O Município dispõe de atribuições nos domínios da habitação e da ação social (art. 23.º, n.º 2, da '+lm+'), podendo conceder apoios em situações de emergência social, nos termos dos seus regulamentos municipais de habitação e de ação social.',
  'A perda da habitação por incapacidade económica temporária, num agregado vulnerável, é precisamente a situação que os apoios de emergência social visam prevenir, sendo a manutenção da habitação uma resposta mais eficaz e menos onerosa do que o posterior realojamento.'];
  asks=['a atribuição de apoio financeiro municipal urgente, de natureza pontual, para pagamento das rendas em atraso e das rendas vincendas durante o período necessário à estabilização da situação do agregado;','subsidiariamente, o enquadramento do agregado nos programas municipais de apoio ao arrendamento e de habitação municipal;','o encaminhamento para a Segurança Social, para avaliação do acesso a prestações sociais, designadamente o Rendimento Social de Inserção;','a mediação do Município junto do senhorio, com vista a evitar o despejo, nos termos do art. 13.º da Lei n.º 83/2019.'];
 }
 if(vs.length)facts.push('Agrava a situação o facto de '+vs.join('; ')+'.');
 const x=f.extra.trim();if(x)facts.push('O(A) requerente acrescenta o seguinte: '+x+(/[.!?]$/.test(x)?'':'.'));
 const close=['Nos termos dos arts. 52.º, n.º 1, e 268.º, n.º 1, da CRP e do art. 13.º do Código do Procedimento Administrativo (CPA), a Administração tem o dever de se pronunciar sobre o presente pedido e de informar o(a) requerente sobre o seu andamento. Dada a urgência e a vulnerabilidade do agregado, requer-se decisão no mais curto prazo possível e, em qualquer caso, dentro do prazo geral de 90 dias previsto no art. 128.º do CPA, com notificação por escrito para a morada ou contacto acima indicados.',
 'Na falta de resposta atempada, o(a) requerente reserva-se o direito de recorrer ao Provedor de Justiça e aos meios judiciais adequados, incluindo a intimação para a prática de ato legalmente devido e as providências cautelares previstas no Código de Processo nos Tribunais Administrativos.',
 'O(A) requerente declara, sob compromisso de honra, que as informações prestadas são verdadeiras.',
 'Junta: cópia do documento de identificação e os documentos comprovativos disponíveis (designadamente notificações, contrato de arrendamento, faturas ou avisos de corte, comprovativos de rendimentos e relatórios médicos).'];
 return {mun,subject,facts,law,asks,close};
}
function makePdf(f,jsPDF){
 const doc=new jsPDF({unit:'mm',format:'a4'}),W=210,M=25,TW=W-2*M,LH=5.8;let y=26;
 const nl=n=>{if(y+n>274){doc.addPage();y=26}};
 const P1=(s,o)=>{o=o||{};doc.setFont('times',o.b?'bold':'normal');doc.setFontSize(12);doc.splitTextToSize(s,o.w||TW).forEach(l=>{nl(LH);doc.text(l,o.x||M,y);y+=LH});y+=o.g==null?3:o.g};
 const t=texto(f),hoje=new Date().toLocaleDateString('pt-PT',{day:'numeric',month:'long',year:'numeric'});let n=1;
 P1('Exmo. Senhor',{x:105,w:80,b:1,g:0});P1('Presidente da Câmara Municipal de '+t.mun,{x:105,w:80,b:1,g:9});
 P1('Assunto: '+t.subject,{b:1,g:6});
 P1(f.nome.trim()+(f.doc?', '+(f.doc.length==11?'NISS':'NIF')+' '+f.doc:'')+', residente em '+f.morada.trim()+', contacto telefónico '+f.tel.trim()+', vem, ao abrigo do direito de petição (art. 52.º da CRP) e do dever de decisão da Administração (art. 13.º do CPA), expor e requerer a V. Ex.ª o seguinte:',{g:6});
 const sec=(ti,arr)=>{nl(22);P1(ti,{b:1,g:3});arr.forEach(s=>P1((n++)+'.º  '+s,{g:3}));y+=3};
 sec('I - DOS FACTOS',t.facts);sec('II - DO DIREITO',t.law);
 nl(28);P1('III - DO PEDIDO',{b:1,g:3});P1('Face ao exposto, requer-se a V. Ex.ª que se digne determinar:',{g:3});
 t.asks.forEach((s,i)=>P1(String.fromCharCode(97+i)+') '+s,{x:M+5,w:TW-5,g:2.5}));y+=3;
 nl(28);P1('IV - DO PRAZO E DA NOTIFICAÇÃO',{b:1,g:3});t.close.forEach(s=>P1(s));
 y+=2;P1('Pede deferimento.',{g:8});P1(t.mun+', '+hoje+'.',{g:4});
 nl(40);y+=16;doc.setLineWidth(.3);doc.line(60,y,150,y);y+=5.5;doc.setFont('times','normal');doc.text('O(A) Requerente',W/2,y,{align:'center'});y+=LH;doc.text(f.nome.trim(),W/2,y,{align:'center'});
 const N=doc.getNumberOfPages();for(let i=1;i<=N;i++){doc.setPage(i);doc.setFont('times','normal');doc.setFontSize(9);doc.text(i+' / '+N,W/2,288,{align:'center'})}
 doc.setProperties({title:'Requerimento - '+t.subject});
 return doc;
}
const loadPdf=()=>import('jspdf'); // carga diferida: jsPDF va en su propio chunk

/* ---------- Interface ---------- */
const inp='w-full min-h-[3.5rem] rounded-xl border-2 bg-card px-4 py-2 text-lg ';
const btn='min-h-[3.5rem] px-6 rounded-xl text-lg font-bold flex items-center justify-center gap-2 ';
const Fld=({id,label,hint,err,children})=>h('div',{className:'mb-6'},
 h('label',{htmlFor:id,className:'block text-lg font-semibold mb-1'},label),
 hint?h('p',{id:id+'h',className:'text-mute mb-2'},hint):null,children,
 err?h('p',{id:id+'e',role:'alert',className:'mt-2 font-semibold text-acc flex gap-2 items-center'},h(I,{n:'tri',s:20}),err):null);
const Opt=({id,type,name,on,set,txt})=>h('label',{className:'flex items-center gap-4 min-h-[3.5rem] p-4 mb-3 rounded-xl border-2 cursor-pointer '+(on?'border-brand bg-brand/10':'border-line bg-card')},
 h('input',{id,type:type||'checkbox',name,checked:on,onChange:set,className:'w-7 h-7 shrink-0 accent-[rgb(var(--brand))]'}),h('span',{className:'text-lg'},txt));
const FS=['100%','112.5%','125%','137.5%'];
const V=(s,f,l)=>{const e={},r=S.e.req[l],d=f.doc;
 if(s===1&&f.mun.trim().length<3)e.mun=r;
 if(s===2){if(!/\S+\s+\S+/.test(f.nome.trim()))e.nome=r;if(f.morada.trim().length<5)e.morada=r;
  if(!/^\+?\d{9,15}$/.test(f.tel.replace(/\s/g,'')))e.tel=S.e.tel[l];
  if(d&&!(d.length==11||(d.length==9&&nifOk(d))))e.doc=S.e.doc[l]}
 if(s===3&&f.sc==='c'&&!/^\d{1,5}([.,]\d{1,2})?$/.test(f.rent.trim()))e.rent=r;
 if(s===4&&!f.ok)e.ok=S.e.ok[l];
 return e};
const E0={sc:'',mun:'',nome:'',doc:'',morada:'',tel:'',kids:false,old:false,dis:false,why:'despejo',srv:'agua',rent:'',arr:'',dt:'',extra:'',ok:false};
const rd=(k,d)=>{try{const v=localStorage.getItem(k);if(v!==null)return +v}catch(e){}return d};

function App(){
 const [li,setLi]=useState(()=>rd('dt_l',/^es/i.test(navigator.language||'')?1:0));
 const [fi,setFi]=useState(()=>rd('dt_f',1));
 const [step,setStep]=useState(0),[f,setF]=useState(E0),[er,setEr]=useState({}),[done,setDone]=useState(false),[busy,setBusy]=useState(false),[msg,setMsg]=useState('');
 const hr=useRef(null),first=useRef(true);
 useEffect(()=>{document.documentElement.lang=['pt-PT','es','kea'][li];try{localStorage.setItem('dt_l',li)}catch(e){}},[li]);
 useEffect(()=>{document.documentElement.style.setProperty('--fs',FS[fi]);try{localStorage.setItem('dt_f',fi)}catch(e){}},[fi]);
 useEffect(()=>{if(first.current){first.current=false;return}window.scrollTo(0,0);hr.current&&hr.current.focus()},[step,done]);
 useEffect(()=>{const t=setTimeout(()=>loadPdf().catch(()=>{}),1500);return()=>clearTimeout(t)},[]);
 const up=(k,v)=>{setF(o=>({...o,[k]:v}));setEr(o=>{const n={...o};delete n[k];return n})};
 const T=(id,o)=>{o=o||{};return h(o.area?'textarea':'input',Object.assign({id,value:f[id],onChange:e=>up(id,o.fn?o.fn(e.target.value):e.target.value),className:inp+(er[id]?'border-acc':'border-line'),'aria-invalid':er[id]?'true':'false','aria-describedby':(o.hint?id+'h ':'')+(er[id]?id+'e':'')},o.p||{}))};
 const go=()=>{const e=V(step,f,li);setEr(e);const k=Object.keys(e)[0];if(k){setTimeout(()=>{const el=document.getElementById(k);el&&el.focus()},0);return}setStep(step+1)};
 async function gen(){
  const e=V(4,f,li);setEr(e);if(Object.keys(e).length)return;
  setBusy(true);setMsg('');
  try{const {jsPDF}=await loadPdf();const doc=makePdf(f,jsPDF);
   const slug=f.mun.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
   const name='requerimento-'+f.sc+'-'+slug+'.pdf';
   doc.save(name);
   setDone(true);
  }catch(x){setMsg(S.fail[li])}
  setBusy(false)}
 const reset=()=>{setF(E0);setEr({});setDone(false);setStep(0);setMsg('')};
 const sc=SC.find(s=>s.id===f.sc);
 const H=(t)=>h('h2',{ref:hr,tabIndex:-1,className:'font-serif text-3xl font-bold mb-5 outline-none'},t);

 const head=h('header',{className:'flex flex-wrap items-center justify-between gap-3 py-4'},
  h('div',{className:'flex items-center gap-3'},h('span',{className:'grid place-items-center w-12 h-12 rounded-xl bg-brand text-bi'},h(I,{n:'home',s:28})),
   h('div',null,h('p',{className:'font-serif text-2xl font-bold leading-none'},'Direito ao Teto'),h('p',{className:'text-sm text-mute mt-1'},S.mov[li]))),
  h('div',{className:'flex items-center gap-2',role:'group','aria-label':'Idioma / Language'},
   ['Português','Español','Kriolu'].map((n,i)=>h('button',{key:n,type:'button','aria-pressed':li===i,'aria-label':n,onClick:()=>setLi(i),className:'min-h-[2.75rem] min-w-[3rem] px-3 rounded-lg font-bold '+(li===i?'bg-brand text-bi':'border-2 border-line')},['PT','ES','CV'][i])),
   h('span',{className:'w-px h-8 bg-line mx-1','aria-hidden':'true'}),
   [0,1].map(d=>h('button',{key:d,type:'button','aria-label':S.a11y[li][d],disabled:d?fi>2:fi<1,onClick:()=>setFi(fi+(d?1:-1)),className:'min-h-[2.75rem] min-w-[2.75rem] rounded-lg border-2 border-line font-bold disabled:opacity-40'},d?'A+':'A-'))));

 let body;
 if(done){
  body=h('div',{className:'fi'},
   h('div',{className:'flex items-center gap-3 text-brand mb-2'},h(I,{n:'check',s:36}),H(S.dT[li])),
   h('p',{className:'text-xl mb-5'},S.dS[li]),
   DS.map((s,i)=>h('div',{key:i,className:'flex gap-4 p-4 mb-3 rounded-2xl border-2 border-line bg-card'},
    h('span',{className:'grid place-items-center w-14 h-14 rounded-xl bg-brand text-bi shrink-0'},h(I,{n:s.ic,s:28})),
    h('div',null,h('p',{className:'text-xl font-bold'},(i+1)+'. '+s.t[li]),h('p',{className:'text-mute'},s.d[li]),
     i===3?h('div',{'aria-hidden':'true',className:'inline-block mt-3 -rotate-3 border-4 border-double border-acc text-acc px-5 py-2 text-center font-bold tracking-widest'},h('div',{className:'text-xl'},S.rec[li]),h('div',{className:'text-sm tracking-normal'},'__/__/____ · __:__ · N.º ______')):null))),
   h('p',{className:'my-5 text-lg font-semibold'},S.aft[li]),
   h('p',{className:'p-4 rounded-xl bg-brand/10 mb-6'},S.help[li]),
   msg?h('p',{role:'alert',className:'mb-4 font-semibold text-acc'},msg):null,
   h('div',{className:'flex flex-col gap-3 sm:flex-row'},
    h('button',{type:'button',onClick:gen,disabled:busy,className:btn+'bg-brand text-bi'},h(I,{n:'dl'}),S.again[li]),
    h('button',{type:'button',onClick:reset,className:btn+'border-2 border-brand text-brand'},S.wipe[li])));
 }else if(step===0){
  body=h('div',{className:'fi'},
   h('p',{className:'text-xl mb-6'},S.tag[li]),H(S.q0[li]),
   SC.map(s=>h('button',{key:s.id,type:'button',onClick:()=>{up('sc',s.id);setStep(1)},className:'w-full text-left flex gap-4 items-center p-5 mb-4 rounded-2xl border-2 border-line bg-card hover:border-brand'},
    h('span',{className:'grid place-items-center w-14 h-14 rounded-xl bg-brand text-bi shrink-0'},h(I,{n:s.ic,s:30})),
    h('span',{className:'grow'},h('b',{className:'block text-xl'},s.t[li]),h('span',{className:'text-mute'},s.d[li])),h(I,{n:'right'}))),
   h('div',{className:'flex gap-3 p-4 rounded-2xl bg-brand/10 mt-6'},h(I,{n:'lock',s:28}),h('div',null,h('p',{className:'font-semibold'},S.priv[li]),h('p',{className:'text-mute'},S.pdf[li]))));
 }else{
  const t=[0,S.q1,S.q2,S.q3,S.q4][step][li];
  let c;
  if(step===1)c=h(Fld,{id:'mun',label:S.mun[li],hint:S.munh[li],err:er.mun},T('mun',{hint:1,p:{list:'mun-l',autoComplete:'off'}}),h('datalist',{id:'mun-l'},MUN.map(m=>h('option',{key:m,value:m}))));
  if(step===2)c=h('div',null,
   h(Fld,{id:'nome',label:S.nome[li],err:er.nome},T('nome',{p:{autoComplete:'name'}})),
   h(Fld,{id:'doc',label:S.doc[li],hint:S.doch[li],err:er.doc},T('doc',{hint:1,fn:v=>v.replace(/\D/g,'').slice(0,11),p:{inputMode:'numeric'}})),
   h(Fld,{id:'morada',label:S.mor[li],err:er.morada},T('morada',{p:{autoComplete:'street-address'}})),
   h(Fld,{id:'tel',label:S.tel[li],err:er.tel},T('tel',{fn:v=>v.replace(/[^\d+ ]/g,'').slice(0,16),p:{type:'tel',autoComplete:'tel'}})));
  if(step===3)c=h('div',null,
   h('fieldset',{className:'mb-6'},h('legend',{className:'text-lg font-semibold mb-3'},S.viv[li]),
    [['kids',S.kids],['old',S.old],['dis',S.dis]].map(a=>h(Opt,{key:a[0],id:a[0],on:f[a[0]],set:e=>up(a[0],e.target.checked),txt:a[1][li]}))),
   f.sc==='a'?h('fieldset',{className:'mb-6'},h('legend',{className:'text-lg font-semibold mb-3'},S.why[li]),Object.keys(S.w).map(k=>h(Opt,{key:k,type:'radio',name:'why',on:f.why===k,set:()=>up('why',k),txt:S.w[k][li]}))):null,
   f.sc==='b'?h('fieldset',{className:'mb-6'},h('legend',{className:'text-lg font-semibold mb-3'},S.srv[li]),Object.keys(S.sv).map(k=>h(Opt,{key:k,type:'radio',name:'srv',on:f.srv===k,set:()=>up('srv',k),txt:S.sv[k][li]}))):null,
   f.sc==='c'?h('div',null,h(Fld,{id:'rent',label:S.rent[li],err:er.rent},T('rent',{fn:v=>v.replace(/[^\d.,]/g,'').slice(0,8),p:{inputMode:'decimal'}})),h(Fld,{id:'arr',label:S.arr[li]},T('arr',{fn:v=>v.replace(/\D/g,'').slice(0,2),p:{inputMode:'numeric'}}))):null,
   h(Fld,{id:'dt',label:S['dt'+f.sc][li]},T('dt',{p:{type:'date'}})),
   h(Fld,{id:'extra',label:S.ext[li],hint:S.exth[li]},T('extra',{area:1,hint:1,p:{rows:3,maxLength:400}})));
  if(step===4){
   const vs=[f.kids&&S.kids,f.old&&S.old,f.dis&&S.dis].filter(Boolean).map(x=>x[li]).join(' · ');
   const rows=[[sc.t[li],f.mun],[S.nome[li],f.nome],[S.mor[li],f.morada],[S.tel[li],f.tel]].concat(vs?[[S.viv[li],vs]]:[]);
   c=h('div',null,h('dl',{className:'mb-6 divide-y divide-line/50'},rows.map((r,i)=>h('div',{key:i,className:'py-3'},h('dt',{className:'text-mute'},r[0]),h('dd',{className:'text-lg font-semibold break-words'},r[1])))),
    h(Opt,{id:'ok',on:f.ok,set:e=>up('ok',e.target.checked),txt:S.decl[li]}),
    er.ok?h('p',{role:'alert',className:'mb-4 font-semibold text-acc'},er.ok):null,
    h('p',{className:'mb-5 text-mute flex gap-2'},h(I,{n:'lock',s:20}),S.pdf[li]),
    msg?h('p',{role:'alert',className:'mb-4 font-semibold text-acc'},msg):null);
  }
  body=h('div',{className:'fi',key:step},
   h('div',{className:'mb-6'},h('p',{className:'font-semibold text-mute mb-2','aria-live':'polite'},S.pas[li]+' '+(step+1)+'/5 · '+S.st[li][step]),
    h('div',{role:'progressbar','aria-valuemin':1,'aria-valuemax':5,'aria-valuenow':step+1,className:'h-3 rounded-full bg-line/40 overflow-hidden'},h('div',{className:'h-full bg-brand transition-all',style:{width:(step+1)*20+'%'}}))),
   H(t),c,
   h('div',{className:'flex gap-3 mt-2'},
    h('button',{type:'button',onClick:()=>setStep(step-1),className:btn+'border-2 border-brand text-brand'},h(I,{n:'left'}),S.back[li]),
    step<4?h('button',{type:'button',onClick:go,className:btn+'grow bg-brand text-bi'},S.next[li],h(I,{n:'right'})):
     h('button',{type:'button',onClick:gen,disabled:busy,className:btn+'grow bg-brand text-bi disabled:opacity-60'},h(I,{n:'dl'}),busy?S.mking[li]:S.mk[li])));
 }
 return h('div',{className:'max-w-xl mx-auto px-4 min-h-screen flex flex-col'},head,
  h('main',{className:'grow pb-8'},h('div',{className:'bg-card rounded-3xl border-2 border-line p-5 sm:p-7'},body)),
  h('footer',{className:'py-6 text-sm text-mute text-center'},h('p',{className:'mb-2'},S.disc[li]),
   h('a',{href:'https://www.linkedin.com/in/leandromorande/',target:'_blank',rel:'noopener noreferrer',className:'opacity-80 hover:opacity-100 underline-offset-4 hover:underline'},'Developed by Leandro Morande')));
}
export default App;
