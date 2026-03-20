import sys
import os

try:
    import markdown
    from xhtml2pdf import pisa
except ImportError:
    print("❌ Error: Missing required libraries!")
    print("💡 Please run: pip install markdown xhtml2pdf")
    sys.exit(1)

def convert_md_to_pdf(input_file, output_file=None):
    """
    Converts a Markdown file to a PDF file.
    
    🎨 LEARNING:
    1. markdown.markdown(): Converts MD text to HTML.
    2. pisa.CreatePDF(): Converts HTML to a PDF binary stream.
    3. utf-8: Always use UTF-8 to support Hindi (title_hi) and other special characters.
    """
    
    if not os.path.exists(input_file):
        print(f"❌ Error: File '{input_file}' not found.")
        return

    # If no output file is provided, use the same name with .pdf extension
    if not output_file:
        output_file = os.path.splitext(input_file)[0] + ".pdf"

    try:
        # Step 1: Read the Markdown content
        with open(input_file, "r", encoding="utf-8") as f:
            md_text = f.read()

        # Step 2: Convert Markdown to HTML
        # We add some basic CSS for better styling
        html_content = f"""
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                @page {{
                    size: A4;
                    margin: 1in;
                }}
                body {{
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                }}
                h1 {{ color: #B32D2D; border-bottom: 2px solid #FFD700; padding-bottom: 10px; }}
                h2 {{ color: #B32D2D; border-bottom: 1px solid #eee; margin-top: 30px; }}
                table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
                th, td {{ border: 1px solid #ddd; padding: 12px; text-align: left; }}
                th {{ background-color: #f8f8f8; font-weight: bold; }}
                code {{ background-color: #f4f4f4; padding: 2px 5px; border-radius: 3px; font-family: monospace; }}
                blockquote {{ border-left: 5px solid #FFD700; padding-left: 20px; color: #666; font-style: italic; }}
            </style>
        </head>
        <body>
            {markdown.markdown(md_text, extensions=['extra', 'codehilite'])}
        </body>
        </html>
        """

        # Step 3: Convert HTML to PDF
        with open(output_file, "w+b") as result_file:
            pisa_status = pisa.CreatePDF(html_content, dest=result_file)

        if pisa_status.err:
            print(f"❌ Error during PDF generation: {pisa_status.err}")
        else:
            print(f"✅ Success! Generated: {output_file}")

    except Exception as e:
        print(f"❌ An error occurred: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("🚀 Usage: python md2pdf.py <input_file.md> [output_file.pdf]")
        print("Example: python md2pdf.py client.md")
    else:
        input_md = sys.argv[1]
        output_pdf = sys.argv[2] if len(sys.argv) > 2 else None
        convert_md_to_pdf(input_md, output_pdf)
