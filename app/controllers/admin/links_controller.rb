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
    link_host = URI(@url)
    link_host.path = ''
    link_host.query = nil
    link_host = link_host.to_s

    begin
      # http://tinyurl.com/q7xkt2z
      uri = URI.parse(@url)
      http = Net::HTTP.new(uri.host, uri.port)
      http.open_timeout = 5
      http.read_timeout = 5
      response = http.get(uri.path.empty? ? '/' : uri.path)
      doc = Nokogiri.parse(response.body)
    rescue => error
      raise error
    end

    @title = doc.css('title').text
  end

  # POST /links
  # POST /links.json
  def create
    @link = Link.new(link_params)

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
      params[:link].permit(:title, :summary, :collective_id, :url, :node_id)
    end
end
