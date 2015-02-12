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

  def user_name_tag(user, options = {})
    link_to(user.name, user_path(user), options)
  end

  def user_avatar_tag(user, size, options = {})
    return nil if user.nil?

    link = true if options[:link].nil?
    gravatar_id = Digest::MD5::hexdigest( user.email.downcase )
    gravatar_url = "https://secure.gravatar.com/avatar/#{gravatar_id}?s=#{size}"
    image = image_tag( gravatar_url, size: "#{size}", alt: user.email, class: "gravatar avatar" )
    if link
      link_to(raw(image), user_path(user))
    else
      raw image
    end
  end

  def timeago(time, options = {})
    options[:class] = options[:class].blank? ? "timeago" : [options[:class],"timeago"].join(" ")
    options.merge!(title: time.iso8601)
    content_tag(:abbr, time.strftime("%Y 年 %m 月 %d 日"), class: options[:class], title: time.iso8601) if time
  end

end
