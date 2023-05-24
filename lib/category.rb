# Category is a directory in the inspiration folder
# Tag is a directory in the category folder
# Image is a file in the tag folder
class Category < ActiveRecord::Base
  has_many :tags, dependent: :destroy

  validates :name, presence: true

  scope :active, -> { where(active: true) }
  scope :hidden, -> { where(active: false) }
  scope :featured, -> { where(featured: true) }

  # delete category folder when category is deleted
  before_destroy :delete_category

  BASE_PATH = "./inspiration"

  def tags_from_directory
    Dir.entries(path)
      .select { |f| File.directory? File.join(path, f) }
      .reject { |f| f == "." || f == ".." }
      .sort
      .map { |tag| Tag.find_or_create_by(name: tag, category_id: id) }
  end

  def self.from_directory
    Dir.entries("./inspiration")
      .select { |f| File.directory? File.join(BASE_PATH, f) }
      .reject { |f| f == "." || f == ".." }
      .reject { |f| f == "system" }
      .sort
      .map { |category| Category.find_or_create_by(name: category) }
  end

  def image
    tags.active.order("rank DESC").first&.cover&.url
  end

  def image_size
    tags.first&.image_size
  end

  def path
    "#{BASE_PATH}/#{name}"
  end

  def delete_category
    FileUtils.rm_rf(path)
  end

  # check if directory still exists and delete record if not
  def check_directory
    unless Dir.exist?(path)
      AppLogger.log.info "Category #{name} directory not found. Deleting category."
      destroy
    end
  end
end
