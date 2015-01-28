module ApplicationHelper
  def inline_svg(path)
    File.open("app/assets/images/#{path}", "rb") do |file|
      raw file.read
    end
  end
  def svg_use(svg_id, extra_class="")
    html = <<-HTML
    <span class="svg-icon #{extra_class}">
      <svg viewBox="0 0 32 32">
        <use xlink:href="##{svg_id}"></use>
      </svg>
    </span>
    HTML
    html
  end
end
