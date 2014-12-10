class Admin::LinksController < Admin::ApplicationController
  before_action :set_link, only: [:show, :edit, :update, :destroy]
  include Admin::LinksHelper

  # GET /links
  # GET /links.json
  def index
    @links = Link.all
  end

  # GET /links/1
  # GET /links/1.json
  def show
  end

  # GET /links/new
  def new
    @link = Link.new
  end

  # GET /links/1/edit
  def edit
  end

  # POST /sort.json
  def sort
    params[:links_ids].each_with_index do |id, index|
      Link.where(id: id).update_all({position: index + 1})
    end
    respond_to do |format|
      format.html
      format.json { head :no_content }
    end
  end

  # POST /create_grapped_link_cover.json
  def create_grapped_link_cover
    grapped_link_cover = GrappedLinkCoverUploader.new
    grapped_link_cover.store!(params[:file])
    grapped_link_cover

    respond_to do |format|
      format.html
      format.json { render json: {
        url: grapped_link_cover.url,
        thumb_url: grapped_link_cover.thumb.url,
        identifier: grapped_link_cover.identifier }
      }
    end
  end

  # GET /get_info
  # GET /get_info.json
  def get_info
    @url = params[:url]

    doc = Nokogiri::HTML(open(@url))

    @title = doc.css('h1').text
    if @title.empty?
      @title = doc.css('title').text
    end

    @grapped_link_covers = doc.css('img').select do |img|
      img[:width].nil? || img[:width].to_i > 300
    end
    .map do |img|
      img['data-origin'] || img['src']
    end.uniq.map do |img_src|
      begin
        image = MiniMagick::Image.open(img_src)
      rescue => error
      end
    end.select do |img|
      unless img.nil?
        img.width > 300
      end
    end.map do |img|
      grapped_link_cover = GrappedLinkCoverUploader.new
      grapped_link_cover.store!(File.open(img.path))
      grapped_link_cover
    end
  end

  # POST /links
  # POST /links.json
  def create
    @link = Link.new(link_params)
    cover_id_from_link = params[:cover_id_from_link]

    unless cover_id_from_link.empty?
      grapped_link_cover_uploader = GrappedLinkCoverUploader.new
      grapped_link_cover_uploader.retrieve_from_store!(cover_id_from_link)

      @link.link_cover = File.open(grapped_link_cover_uploader.current_path)
      @link.save!
    end

    respond_to do |format|
      if @link.save
        format.html { redirect_to [:admin, @link], notice: 'Link was successfully created.' }
        format.json { render :show, status: :created, location: [:admin, @link] }
      else
        format.html { render :new }
        format.json { render json: @link.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /links/1
  # PATCH/PUT /links/1.json
  def update
    respond_to do |format|
      if @link.update(link_params)

        # TODO(yangqing): DRY
        cover_id_from_link = params[:cover_id_from_link]

        unless cover_id_from_link.empty?
          grapped_link_cover_uploader = GrappedLinkCoverUploader.new
          grapped_link_cover_uploader.retrieve_from_store!(cover_id_from_link)

          @link.link_cover = File.open(grapped_link_cover_uploader.current_path)
          @link.save!
        end
        format.html { redirect_to [:admin, @link], notice: 'Link was successfully updated.' }
        format.json { render :show, status: :ok, location: [:admin, @link] }
      else
        format.html { render :edit }
        format.json { render json: @link.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /links/1
  # DELETE /links/1.json
  def destroy
    @link.destroy
    respond_to do |format|
      format.html { redirect_to admin_links_url, notice: 'Link was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_link
      @link = Link.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def link_params
      params[:link].permit(:title, :summary, :collective_id, :url)
    end
end
