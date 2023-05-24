class Image < ActiveRecord::Base
  belongs_to :tag

  validates :name, presence: true
  validates :tag_id, presence: true

  # set path before create
  before_create :set_path

  def set_path
    self.path = "./inspiration/#{tag.category.name}/#{tag.name}/#{name}"
  end

  # returns url to the first image in tag dir
  def url
    path.gsub("./", "/")
  end

  # check if file still exists and delete record if not
  def check_file
    destroy unless File.exist?(path)
  end
end
