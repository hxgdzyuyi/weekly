module AdminHelper
  def is_active?(controller_name)
    'active' if params[:controller] == controller_name.to_s
  end
end
