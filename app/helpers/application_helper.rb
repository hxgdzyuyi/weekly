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

  def gravatar_for(user, size)
    gravatar_id = Digest::MD5::hexdigest( user.email.downcase )
    gravatar_url = "https://secure.gravatar.com/avatar/#{gravatar_id}?s=#{size}"
    image_tag( gravatar_url, alt: user.email, class: "gravatar" )
  end

end
