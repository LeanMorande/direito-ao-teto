/* Texto jurídico y generación del PDF (siempre portugués de Portugal) */
const fd=s=>new Date(s+'T12:00:00').toLocaleDateString('pt-PT',{day:'numeric',month:'long',year:'numeric'});
export const nifOk=v=>{let s=0;for(let i=0;i<8;i++)s+=v[i]*(9-i);let c=11-s%11;if(c>9)c=0;return c==v[8]};
export function texto(f){
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
export function makePdf(f,jsPDF){
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
export const loadPdf=()=>import('jspdf'); // carga diferida: jsPDF va en su propio chunk
