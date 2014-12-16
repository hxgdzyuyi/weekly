class CollectivesController < ApplicationController
  before_action :set_collective, only: [:show]

  def show
  end

  def index
    @collectives = Collective.all
  end
  private
    # Use callbacks to share common setup or constraints between actions.
    def set_collective
      @collective = Collective.find(params[:id])
    end
end
