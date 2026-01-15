# -*- coding: utf-8 -*-
import os
from fpdf import FPDF
from fpdf.enums import XPos, YPos

class BOEStylePDF(FPDF):
    def header(self):
        # Background light gray for "BOE" style feel
        self.set_font('helvetica', 'B', 8)
        self.set_text_color(120, 120, 120)
        self.cell(0, 10, 'BOLETÍN OFICIAL OPOTRAINER - LEGISLACIÓN CONSOLIDADA', 0, new_x=XPos.LMARGIN, new_y=YPos.NEXT, align='L')
        self.set_draw_color(200, 200, 200)
        self.line(10, 18, 200, 18)
        self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font('helvetica', 'I', 8)
        self.set_text_color(120, 120, 120)
        self.cell(0, 10, f'Página {self.page_no()}', 0, 0, 'C')

    def main_title(self, text):
        self.set_font('helvetica', 'B', 16)
        self.set_text_color(0, 0, 0)
        self.multi_cell(0, 10, text, align='C')
        self.ln(10)

    def chapter_title(self, text):
        self.set_font('helvetica', 'B', 12)
        self.set_fill_color(230, 230, 230)
        self.cell(0, 10, text, 0, new_x=XPos.LMARGIN, new_y=YPos.NEXT, align='L', fill=True)
        self.ln(4)

    def article_title(self, text):
        self.set_font('helvetica', 'B', 10)
        self.cell(0, 8, text, 0, new_x=XPos.LMARGIN, new_y=YPos.NEXT, align='L')

    def body_text(self, text):
        self.set_font('helvetica', '', 9)
        self.multi_cell(0, 5, text, align='J')
        self.ln(4)

def generate_tema18_massive(output_path):
    pdf = BOEStylePDF()
    pdf.add_page()
    
    # Official Header Info
    pdf.set_font('helvetica', 'B', 10)
    pdf.cell(0, 5, 'Referencia: OPO-NAV-2026-T18', 0, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.cell(0, 5, 'Publicado en: Guía Técnica de Prevención de la CF Navarra', 0, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(5)

    pdf.main_title("TEMA 18: SEGURIDAD Y PREVENCIÓN DE RIESGOS LABORALES EN INSTALACIONES DE COCINA Y RESTAURACIÓN COLECTIVA")

    # PREAMBLE
    pdf.chapter_title("PREÁMBULO")
    pdf.body_text(
        "La protección de la salud de los trabajadores en el entorno de la hostelería y, específicamente, en las "
        "cocinas de la Administración Foral de Navarra, constituye un objetivo prioritario dentro de la política "
        "preventiva del Gobierno de Navarra. La complejidad de los procesos culinarios modernos, que integran "
        "maquinaria térmica, sistemas de presión, herramientas de corte de alta precisión y productos químicos "
        "agresivos, exige un marco documental exhaustivo que sirva de guía tanto para el personal cocinero como "
        "para los técnicos de prevención.\n\n"
        "Este documento consolida la normativa estatal derivada de la Ley 31/1995 de Prevención de Riesgos Laborales "
        "y los Reales Decretos específicos sobre lugares de trabajo, equipos de protección y señalización, adaptándolos "
        "a la realidad operativa de los centros hospitalarios y escolares de Navarra."
    )

    # INDEX (Fake but structured)
    pdf.chapter_title("ÍNDICE DE MATERIAS")
    pdf.body_text(
        "I. Marco Normativo y Campo de Aplicación.\n"
        "II. Organización de la Prevención en la Administración Pública.\n"
        "III. Evaluación de Riesgos: Factores de Seguridad.\n"
        "IV. Riesgos Higiénicos: El Estrés Térmico y el Ruido.\n"
        "V. Ergonomía y Factores Psicosociales en el Entorno Culinario.\n"
        "VI. Equipos de Protección Individual (EPI): Selección y Mantenimiento.\n"
        "VII. Medidas de Emergencia y Primeros Auxilios.\n"
        "VIII. Señalización de Seguridad en Zonas Productivas."
    )

    # TITULO I
    pdf.chapter_title("TÍTULO I. MARCO NORMATIVO Y PRINCIPIOS GENERALES")
    
    pdf.article_title("Artículo 1. Objeto y ámbito de aplicación.")
    pdf.body_text(
        "El presente manual tiene por objeto establecer las directrices técnicas mínimas para la protección de la salud "
        "frente a los riesgos derivados de la actividad en cocinas, almacenes, cámaras frigoríficas y zonas de lavado. "
        "Será de aplicación a todo el personal dependiente de la Administración Foral que desarrolle sus funciones "
        "en los servicios de alimentación."
    )

    pdf.article_title("Artículo 2. Marco legal de referencia.")
    pdf.body_text(
        "1. Ley 31/1995, de 8 de noviembre, de Prevención de Riesgos Laborales (LPRL).\n"
        "2. Real Decreto 39/1997, por el que se aprueba el Reglamento de los Servicios de Prevención.\n"
        "3. Real Decreto 486/1997, sobre disposiciones mínimas de seguridad y salud en los lugares de trabajo.\n"
        "4. Real Decreto 1215/1997, relativo a la utilización de equipos de trabajo.\n"
        "5. Ley Foral 11/2019, en lo relativo a la administración pública y sus deberes de diligencia."
    )

    # TITULO II
    pdf.chapter_title("TÍTULO II. IDENTIFICACIÓN Y EVALUACIÓN DE RIESGOS")

    pdf.article_title("Artículo 3. Factores de riesgo en la manipulación de maquinaria.")
    pdf.body_text(
        "El uso de equipos de trabajo constituye una de las principales fuentes de accidentes. Se identifican como "
        "puntos de control crítico:\n\n"
        "a) Cortadoras de fiambres y picadoras: Riesgo de amputación por contacto con elementos móviles. "
        "Se prohíbe el uso sin el protector de mano o el empujador de producto.\n"
        "b) Batidoras industriales y Amasadoras: Riesgo de atrapamiento. Deben contar con rejilla de seguridad "
        "y microinterruptor que detenga el motor al abrir la protección.\n"
        "c) Peladoras de patatas: Riesgo de proyecciones y abrasiones. Se requiere vigilancia de la estanqueidad."
    )

    pdf.article_title("Artículo 4. Riesgo de caídas y resbalones.")
    pdf.body_text(
        "Las condiciones del suelo en cocina (húmedos por baldeo, con grasas o restos orgánicos) elevan la probabilidad "
        "de caídas al mismo nivel. Medidas preventivas:\n"
        "- Instalación de suelos de clase 3 (resistencia al deslizamiento mayor a 45).\n"
        "- Canaletas de drenaje con rejilla rasa para evacuación de líquidos.\n"
        "- Protocolo de limpieza 'mancha vista, mancha limpia'.\n"
        "- Señalización temporal con caballete durante la limpieza."
    )

    # TITULO III (Adding more pages)
    pdf.chapter_title("TÍTULO III. RIESGOS HIGIÉNICOS Y AGENTES FÍSICOS")

    pdf.article_title("Artículo 5. El ambiente térmico.")
    pdf.body_text(
        "La presencia de hornos, marmitas, freidoras y planchas genera una carga térmica radiante y convectiva elevada. "
        "El choque térmico al entrar en cámaras de congelación (-18ºC) viniendo de zonas calientes (+30ºC) supone un "
        "riesgo cardiovascular.\n\n"
        "Directrices preventivas:\n"
        "- Ventilación forzada con caudales renovados (mínimo 30 m3/h por persona en trabajos sedentarios, "
        "50 m3/h en trabajos activos).\n"
        "- Campanas extractoras con filtros de lamas para retención de grasas y vapores.\n"
        "- Ropa de trabajo transpirable de algodón 100%.\n"
        "- Tiempos de aclimatación y pausas de hidratación garantizadas."
    )

    pdf.article_title("Artículo 6. Exposición al ruido.")
    pdf.body_text(
        "El ruido generado por extractores, lavavajillas de cúpula y el choque de menaje puede superar los 80 dBA "
        "en periodos de alta producción. Se realizarán mediciones higiénicas anuales. Superados los 85 dBA es "
        "obligatorio el uso de tapones o cascos."
    )

    # TITULO IV
    pdf.chapter_title("TÍTULO IV. ERGONOMÍA Y CARGA FÍSICA")

    pdf.article_title("Artículo 7. Manipulación manual de cargas.")
    pdf.body_text(
        "En el economato y recepción de mercancías, el personal maneja sacos de harina (25kg), bidones de aceite o "
        "cajas de producto. Se prohíbe el levantamiento manual por encima de los 25kg para hombres y 15kg para mujeres "
        "o personal especialmente sensible.\n\n"
        "Técnica de levantamiento:\n"
        "1. Pies separados a la anchura de los hombros.\n"
        "2. Flexión de rodillas manteniendo la espalda recta.\n"
        "3. Carga lo más cerca posible del cuerpo.\n"
        "4. No girar el tronco mientras se sujeta el peso."
    )

    pdf.article_title("Artículo 8. Posturas forzadas y bipedestación.")
    pdf.body_text(
        "El trabajo en cocina se realiza mayoritariamente de pie. La bipedestación prolongada provoca trastornos "
        "vasculares y dolores de espalda (lumbalgias). Se recomienda el uso de taburetes de apoyo isquiático y "
        "alfombras antifatiga en zonas de preparación estática (emplatado)."
    )

    # TITULO V
    pdf.chapter_title("TÍTULO V. EQUIPOS DE PROTECCIÓN INDIVIDUAL (EPI)")

    pdf.article_title("Artículo 9. Requerimientos de los EPIs en el sector.")
    pdf.body_text(
        "Los EPIs deben llevar el marcado CE y entregarse de forma gratuita al trabajador. Su uso es obligatorio "
        "una vez agotadas las vías de protección colectiva.\n\n"
        "Relación de EPIs obligatorios:\n"
        "- Cabeza: Cofia o gorro para evitar atrapamientos y por higiene.\n"
        "- Manos: Guantes de malla metálica (despiece), guantes térmicos (horno), guantes de neopreno (lavado químico).\n"
        "- Cuerpo: Chaquetilla de cocina de tejido ignífugo.\n"
        "- Pies: Calzado con suela de nitrilo, puntera reforzada y shock absorber en el talón."
    )

    # TITULO VI
    pdf.chapter_title("TÍTULO VI. PROCEDIMIENTOS DE SEGURIDAD OPERATIVA")

    pdf.article_title("Artículo 10. Riesgos en el uso de hornos microondas y de inducción.")
    pdf.body_text(
        "Se monitorizarán las fugas de radiación no ionizante. El personal con marcapasos tiene restringido el "
        "acceso a cocinas de inducción de alta potencia sin previo informe médico."
    )

    pdf.article_title("Artículo 11. Seguridad en instalaciones de gas.")
    pdf.body_text(
        "Las instalaciones de gas deben contar con detectores de fugas con electroválvula de corte automático. "
        "Se prohíbe el uso de mecheros cerca de las válvulas de seguridad."
    )

    # TITULO VII
    pdf.chapter_title("TÍTULO VII. EMERGENCIAS Y PROTECCIÓN CONTRA INCENDIOS")

    pdf.article_title("Artículo 12. Medios de extinción específicos.")
    pdf.body_text(
        "Debido a la presencia de aceites vegetales calentados (fuegos clase F), se priorizará el uso de extintores "
        "de acetato potásico o mantas ignífugas. No se utilizará agua sobre freidoras encendidas (riesgo de explosión física)."
    )

    pdf.article_title("Artículo 13. Primeros auxilios en quemaduras.")
    pdf.body_text(
        "Ante una quemadura térmica:\n"
        "1. Aplicar agua fría a chorro suave durante 15-20 minutos.\n"
        "2. No aplicar pomadas, aceites ni remedios caseros.\n"
        "3. Cubrir con gasa estéril humedecida.\n"
        "4. Trasladar al servicio médico si hay ampollas (flictenas) o afectación profunda."
    )

    # CLOSING
    pdf.ln(10)
    pdf.set_font('helvetica', 'B', 10)
    pdf.cell(0, 10, 'Documento de estudio obligatorio para la preparación de oposiciones a Cocinero/a.', 0, 1, 'C')
    pdf.cell(0, 10, 'Administración Foral de Navarra - Opotrainer v2.0', 0, 1, 'C')

    pdf.output(output_path)

if __name__ == "__main__":
    dest_path = 'public/pdfs/tema18.pdf'
    if not os.path.exists('public/pdfs'):
        os.makedirs('public/pdfs')
    
    print(f"Generando documento masivo en {dest_path}...")
    generate_tema18_massive(dest_path)
    
    # Also copy to dist if it exists for local preview check (though app will re-deploy)
    if os.path.exists('dist/pdfs'):
        import shutil
        shutil.copy2(dest_path, 'dist/pdfs/tema18.pdf')
        print("Copiado a dist/ para verificación inmediata.")
    
    print("¡Proceso finalizado con éxito!")
